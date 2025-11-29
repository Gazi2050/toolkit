<script lang="ts">
	import { Copy, Trash2, FileJson, Minimize, Maximize } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	
	let input = $state('');
	let output = $state('');
	let error = $state<{ message: string; line?: number; column?: number; snippet?: string } | null>(null);
	let mode: 'format' | 'minify' = $state('format');
	
	let inputElement: HTMLTextAreaElement;
	let inputLinesElement: HTMLDivElement;
	let outputElement: HTMLPreElement;
	let outputLinesElement: HTMLDivElement;

	function getErrorDetails(e: Error, json: string) {
		const msg = e.message;
		let line = 0;
		let column = 0;
		let snippet = '';

		// Try to extract position from message (e.g., "at position 123")
		const match = msg.match(/at position (\d+)/);
		if (match) {
			const pos = parseInt(match[1], 10);
			const lines = json.substring(0, pos).split('\n');
			line = lines.length;
			column = lines[lines.length - 1].length + 1;

			// Get snippet around error
			const linesAll = json.split('\n');
			const startLine = Math.max(0, line - 2);
			const endLine = Math.min(linesAll.length, line + 1);
			snippet = linesAll.slice(startLine, endLine).map((l, i) => {
				const currentLine = startLine + i + 1;
				const isErrorLine = currentLine === line;
				return `${isErrorLine ? '>' : ' '} ${currentLine} | ${l}`;
			}).join('\n');
		}

		return { message: msg, line, column, snippet };
	}

	function formatJSON() {
		try {
			if (!input.trim()) {
				output = '';
				error = null;
				return;
			}
			const parsed = JSON.parse(input);
			output = JSON.stringify(parsed, null, 2);
			error = null;
			mode = 'format';
		} catch (e) {
			error = getErrorDetails(e as Error, input);
			output = '';
		}
	}

	function minifyJSON() {
		try {
			if (!input.trim()) {
				output = '';
				error = null;
				return;
			}
			const parsed = JSON.parse(input);
			output = JSON.stringify(parsed);
			error = null;
			mode = 'minify';
		} catch (e) {
			error = getErrorDetails(e as Error, input);
			output = '';
		}
	}

	function clear() {
		input = '';
		output = '';
		error = null;
	}

	function copyToClipboard() {
		if (output) {
			navigator.clipboard.writeText(output);
		}
	}

	function handleInputScroll() {
		if (inputLinesElement && inputElement) {
			inputLinesElement.scrollTop = inputElement.scrollTop;
		}
	}

	function handleOutputScroll() {
		if (outputLinesElement && outputElement) {
			outputLinesElement.scrollTop = outputElement.scrollTop;
		}
	}

	let inputLineNumbers = $derived(input.split('\n').map((_, i) => i + 1));
	let outputLineNumbers = $derived(output.split('\n').map((_, i) => i + 1));
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-2">
		<Button onclick={formatJSON}>
			<Maximize class="mr-2 h-4 w-4" />
			Format
		</Button>
		<Button variant="outline" onclick={minifyJSON}>
			<Minimize class="mr-2 h-4 w-4" />
			Minify
		</Button>
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
			<div class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/50 focus-within:ring-1 focus-within:ring-primary/30 {error ? 'border-red-500/50 focus-within:ring-red-500/30' : ''}">
				<!-- Line Numbers -->
				<div
					bind:this={inputLinesElement}
					class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
					style="width: 3rem;"
				>
					{#each inputLineNumbers as line}
						<div class="px-2">{line}</div>
					{/each}
				</div>
				<!-- Textarea -->
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
						<Copy class="h-4 w-4" />
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
					<!-- Line Numbers -->
					<div
						bind:this={outputLinesElement}
						class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
						style="width: 3rem;"
					>
						{#each outputLineNumbers as line}
							<div class="px-2">{line}</div>
						{/each}
					</div>
					<!-- Output -->
					<pre
						bind:this={outputElement}
						onscroll={handleOutputScroll}
						class="custom-scrollbar h-full flex-1 overflow-auto bg-transparent p-4 font-mono text-sm text-green-400 whitespace-pre"
					>{output}</pre>
				{/if}
			</div>
		</div>
	</div>
</div>
