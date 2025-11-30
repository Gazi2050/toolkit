<script lang="ts">
	import { Copy, Maximize, Minimize, Check } from '@lucide/svelte';

	let input = $state('');
	let output = $state('');
	let error = $state<{ message: string; line?: number; column?: number; snippet?: string } | null>(
		null
	);
	let copied = $state(false);

	let inputElement = $state<HTMLTextAreaElement | null>(null);
	let inputLinesElement = $state<HTMLDivElement | null>(null);
	let outputElement = $state<HTMLPreElement | null>(null);
	let outputLinesElement = $state<HTMLDivElement | null>(null);

	/**
	 * Parses error message to extract line and column numbers and creates a code snippet
	 * @param e - The error object
	 * @param json - The input JSON string
	 */
	function getErrorDetails(e: Error, json: string) {
		const msg = e.message;
		let line = 0;
		let column = 0;
		let snippet = '';

		const match = msg.match(/at position (\d+)/);
		if (match) {
			const pos = parseInt(match[1], 10);
			const lines = json.substring(0, pos).split('\n');
			line = lines.length;
			column = lines[lines.length - 1].length + 1;

			const linesAll = json.split('\n');
			const startLine = Math.max(0, line - 2);
			const endLine = Math.min(linesAll.length, line + 1);
			snippet = linesAll
				.slice(startLine, endLine)
				.map((l, i) => {
					const currentLine = startLine + i + 1;
					const isErrorLine = currentLine === line;
					return `${isErrorLine ? '>' : ' '} ${currentLine} | ${l}`;
				})
				.join('\n');
		}

		return { message: msg, line, column, snippet };
	}

	/**
	 * Formats the input JSON string with 2-space indentation
	 */
	function formatJSON(): void {
		try {
			if (!input.trim()) {
				output = '';
				error = null;
				return;
			}
			const parsed = JSON.parse(input);
			output = JSON.stringify(parsed, null, 2);
			error = null;
		} catch (e) {
			error = getErrorDetails(e as Error, input);
			output = '';
		}
	}

	/**
	 * Minifies the input JSON string by removing whitespace
	 */
	function minifyJSON(): void {
		try {
			if (!input.trim()) {
				output = '';
				error = null;
				return;
			}
			const parsed = JSON.parse(input);
			output = JSON.stringify(parsed);
			error = null;
		} catch (e) {
			error = getErrorDetails(e as Error, input);
			output = '';
		}
	}

	/**
	 * Clears all input, output, and error states
	 */
	function clear(): void {
		input = '';
		output = '';
		error = null;
	}

	/**
	 * Copies the output content to clipboard
	 */
	function copyToClipboard(): void {
		if (output) {
			navigator.clipboard.writeText(output);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	/**
	 * Syncs scroll position of input line numbers with textarea
	 */
	function handleInputScroll(): void {
		if (inputLinesElement && inputElement) {
			inputLinesElement.scrollTop = inputElement.scrollTop;
		}
	}

	/**
	 * Syncs scroll position of output line numbers with pre element
	 */
	function handleOutputScroll(): void {
		if (outputLinesElement && outputElement) {
			outputLinesElement.scrollTop = outputElement.scrollTop;
		}
	}

	let inputLineNumbers = $derived(input.split('\n').map((_, i) => i + 1));
	let outputLineNumbers = $derived(output.split('\n').map((_, i) => i + 1));
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-2">
		<button
			onclick={formatJSON}
			class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary/30"
		>
			<Maximize class="h-4 w-4" />
			Format
		</button>
		<button
			onclick={minifyJSON}
			class="inline-flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
		>
			<Minimize class="h-4 w-4" />
			Minify
		</button>
	</div>

	<div class="grid h-[calc(100vh-18rem)] gap-4 lg:grid-cols-2">
		<div class="flex h-full min-h-0 flex-col gap-2">
			<div class="flex items-center justify-between">
				<label for="json-input" class="text-sm font-medium text-muted-foreground">Input JSON</label>
				<div class="flex gap-2">
					<button class="text-xs text-muted-foreground hover:text-foreground" onclick={clear}>
						Clear
					</button>
				</div>
			</div>
			<div
				class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/50 focus-within:ring-1 focus-within:ring-primary/30 {error
					? 'border-red-500/50 focus-within:ring-red-500/30'
					: ''}"
			>
				<div
					bind:this={inputLinesElement}
					class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
					style="width: 3rem;"
				>
					{#each inputLineNumbers as line (line)}
						<div class="px-2">{line}</div>
					{/each}
				</div>
				<textarea
					id="json-input"
					bind:this={inputElement}
					bind:value={input}
					onscroll={handleInputScroll}
					class="custom-scrollbar flex-1 resize-none bg-transparent p-4 font-mono text-sm whitespace-pre focus:outline-none"
					placeholder="Paste your JSON here..."
				></textarea>
			</div>
		</div>

		<div class="flex h-full min-h-0 flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-muted-foreground">Output</span>
				<div class="flex gap-2">
					<button
						class="rounded-md p-1 hover:bg-muted"
						onclick={copyToClipboard}
						title="Copy to clipboard"
					>
						{#if copied}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
				</div>
			</div>
			<div class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/50">
				{#if error}
					<div class="absolute inset-0 overflow-auto p-4 text-red-500">
						<div class="mb-2 flex items-center gap-2 font-semibold">
							<div class="h-2 w-2 rounded-full bg-red-500"></div>
							Invalid JSON
						</div>
						<p class="mb-4 text-sm opacity-90">{error.message}</p>
						{#if error.snippet}
							<div class="rounded bg-red-950/30 p-3 font-mono text-xs text-red-200">
								<pre>{error.snippet}</pre>
							</div>
							<p class="mt-2 text-xs text-red-400">
								Check line {error.line}, column {error.column}
							</p>
						{/if}
					</div>
				{:else}
					<div
						bind:this={outputLinesElement}
						class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
						style="width: 3rem;"
					>
						{#each outputLineNumbers as line (line)}
							<div class="px-2">{line}</div>
						{/each}
					</div>
					<pre
						bind:this={outputElement}
						onscroll={handleOutputScroll}
						class="custom-scrollbar h-full flex-1 overflow-auto bg-transparent p-4 font-mono text-sm text-green-400 whitespace-pre">{output}</pre>
				{/if}
			</div>
		</div>
	</div>
</div>
