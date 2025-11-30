<script lang="ts">
	import { Upload, FileText, Copy, RefreshCw, AlertCircle, Loader2, Check } from '@lucide/svelte';
	import Tesseract from 'tesseract.js';

	let file = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let extractedText = $state('');
	let progress = $state(0);
	let status = $state('');
	let isProcessing = $state(false);
	let error = $state<string | null>(null);
	let isDragging = $state(false);
	let fileType = $state<'image' | 'pdf' | null>(null);
	let copied = $state(false);

	/**
	 * Dynamically imports pdfjs-dist and sets up the worker
	 */
	async function getPdfLib() {
		const pdfjsLib = await import('pdfjs-dist');
		pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
			'pdfjs-dist/build/pdf.worker.min.mjs',
			import.meta.url
		).href;
		return pdfjsLib;
	}

	/**
	 * Handles drag over event
	 */
	function handleDragOver(e: DragEvent): void {
		e.preventDefault();
		isDragging = true;
	}

	/**
	 * Handles drag leave event
	 */
	function handleDragLeave(): void {
		isDragging = false;
	}

	/**
	 * Handles file drop event
	 */
	function handleDrop(e: DragEvent): void {
		e.preventDefault();
		isDragging = false;

		if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
			handleFile(e.dataTransfer.files[0]);
		}
	}

	/**
	 * Handles file input change event
	 */
	function handleFileInput(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			handleFile(target.files[0]);
		}
	}

	/**
	 * Processes the selected file and sets up preview
	 * @param newFile - The file to process
	 */
	function handleFile(newFile: File): void {
		const isImage = ['image/png', 'image/jpeg', 'image/webp'].includes(newFile.type);
		const isPdf = newFile.type === 'application/pdf';

		if (!isImage && !isPdf) {
			error = 'Supported formats: PNG, JPG, WEBP, PDF';
			return;
		}

		file = newFile;
		error = null;
		extractedText = '';
		progress = 0;
		status = '';

		if (isImage) {
			fileType = 'image';
			previewUrl = URL.createObjectURL(newFile);
		} else if (isPdf) {
			fileType = 'pdf';
			previewUrl = null;
			renderPdfPreview(newFile);
		}
	}

	/**
	 * Renders the first page of a PDF as a preview image
	 * @param file - The PDF file
	 */
	async function renderPdfPreview(file: File): Promise<void> {
		try {
			const pdfjsLib = await getPdfLib();
			const arrayBuffer = await file.arrayBuffer();
			const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
			const page = await pdf.getPage(1);
			const viewport = page.getViewport({ scale: 1.0 });

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			if (context) {
				await page.render({
					canvas: canvas,
					viewport: viewport
				}).promise;
				previewUrl = canvas.toDataURL();
			}
		} catch (e) {
			console.error('Failed to render PDF preview', e);
		}
	}

	/**
	 * Extracts text from the loaded file (Image or PDF) using OCR
	 */
	async function extractText(): Promise<void> {
		if (!file || !fileType) return;

		isProcessing = true;
		error = null;
		extractedText = '';

		try {
			if (fileType === 'pdf') {
				const pdfjsLib = await getPdfLib();
				const arrayBuffer = await file.arrayBuffer();
				const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
				const numPages = pdf.numPages;

				const worker = await Tesseract.createWorker('eng', 1, {
					logger: () => {}
				});

				for (let i = 1; i <= numPages; i++) {
					status = `Processing page ${i} of ${numPages}...`;
					progress = Math.round(((i - 1) / numPages) * 100);

					const page = await pdf.getPage(i);
					const viewport = page.getViewport({ scale: 2.0 });

					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d');
					canvas.height = viewport.height;
					canvas.width = viewport.width;

					if (context) {
						await page.render({
							canvas: canvas,
							viewport: viewport
						}).promise;
						const {
							data: { text }
						} = await worker.recognize(canvas);
						extractedText += `--- Page ${i} ---\n${text}\n\n`;
					}
				}
				await worker.terminate();
				progress = 100;
				status = 'Completed';
			} else {
				const worker = await Tesseract.createWorker('eng', 1, {
					logger: (m) => {
						if (m.status === 'recognizing text') {
							progress = Math.round(m.progress * 100);
							status = `Recognizing text... ${progress}%`;
						} else {
							status = m.status;
						}
					}
				});

				const {
					data: { text }
				} = await worker.recognize(file);
				extractedText = text;
				await worker.terminate();
			}
		} catch (e) {
			console.error(e);
			error = 'Failed to extract text. Please try another file.';
		} finally {
			isProcessing = false;
			status = '';
		}
	}

	/**
	 * Copies extracted text to clipboard
	 */
	function copyText(): void {
		if (extractedText) {
			navigator.clipboard.writeText(extractedText);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	/**
	 * Clears all file data and results
	 */
	function clear(): void {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		file = null;
		previewUrl = null;
		extractedText = '';
		error = null;
		progress = 0;
	}
</script>

<div class="flex max-h-[calc(100vh-10rem)] flex-col gap-4 overflow-hidden">
	{#if !file}
		<div
			role="button"
			tabindex="0"
			class="relative flex min-h-[200px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:bg-muted/80 {isDragging
				? 'border-primary bg-primary/5'
				: ''}"
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			onclick={() => document.getElementById('file-upload')?.click()}
			onkeydown={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
		>
			<input
				id="file-upload"
				type="file"
				accept="image/png,image/jpeg,image/webp,application/pdf"
				class="hidden"
				onchange={handleFileInput}
			/>

			<div class="flex flex-col items-center gap-2 text-center">
				<div class="rounded-full bg-background p-4 shadow-sm">
					<Upload class="h-8 w-8 text-muted-foreground" />
				</div>
				<div class="mt-2 text-lg font-medium">Drop an image or PDF here or click to upload</div>
				<p class="text-sm text-muted-foreground">Supports PNG, JPG, WEBP, PDF</p>
			</div>
		</div>
	{:else}
		<div class="grid flex-1 gap-4 overflow-hidden lg:grid-cols-2">
			<div class="flex min-h-0 flex-col gap-3">
				<div class="relative min-h-0 flex-1 overflow-hidden rounded-lg border bg-muted/50">
					{#if previewUrl}
						<img src={previewUrl} alt="Preview" class="h-full w-full object-contain" />
					{:else}
						<div class="flex h-full w-full items-center justify-center bg-muted/30">
							<div class="flex flex-col items-center gap-2 text-muted-foreground">
								<FileText class="h-16 w-16" />
								<span class="text-sm font-medium">PDF Document</span>
							</div>
						</div>
					{/if}
					{#if isProcessing}
						<div
							class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm"
						>
							<div class="flex flex-col items-center gap-3 rounded-lg bg-background p-6 shadow-lg">
								<Loader2 class="h-8 w-8 animate-spin text-primary" />
								<div class="text-sm font-medium">{status || 'Processing...'}</div>
								{#if progress > 0}
									<div class="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
										<div
											class="h-full bg-primary transition-all duration-300"
											style="width: {progress}%"
										></div>
									</div>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				<div class="flex gap-2">
					<button
						onclick={extractText}
						disabled={isProcessing}
						class="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
					>
						<FileText class="h-4 w-4" />
						Extract Text
					</button>
					<button
						onclick={clear}
						disabled={isProcessing}
						class="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent disabled:opacity-50"
					>
						<RefreshCw class="h-4 w-4" />
						New
					</button>
				</div>
			</div>

			<div class="flex min-h-0 flex-col gap-2">
				<div class="flex items-center justify-between">
					<label for="extracted-text" class="text-sm font-medium text-muted-foreground"
						>Extracted Text</label
					>
					<button
						onclick={copyText}
						disabled={!extractedText}
						class="inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
					>
						{#if copied}
							<Check class="h-3 w-3 text-green-500" />
							Copied
						{:else}
							<Copy class="h-3 w-3" />
							Copy
						{/if}
					</button>
				</div>
				<textarea
					id="extracted-text"
					readonly
					value={extractedText}
					class="min-h-0 flex-1 resize-none rounded-lg border bg-muted/30 p-3 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary/30"
					placeholder="Extracted text will appear here..."
				></textarea>
			</div>
		</div>
	{/if}

	{#if error}
		<div
			class="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
		>
			<AlertCircle class="h-4 w-4" />
			{error}
		</div>
	{/if}
</div>
