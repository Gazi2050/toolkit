<script lang="ts">
	import { diffChars, diffLines, diffWords } from 'diff';
	import { Trash2 } from '@lucide/svelte';

	let oldText = $state('');
	let newText = $state('');
	let diffResult: any[] = $state([]);
	let mode: 'chars' | 'words' | 'lines' = $state('lines');

	let oldTextElement: HTMLTextAreaElement;
	let oldTextLinesElement: HTMLDivElement;
	let newTextElement: HTMLTextAreaElement;
	let newTextLinesElement: HTMLDivElement;
	let outputElement: HTMLDivElement;
	let outputLinesElement: HTMLDivElement;

	/**
	 * Calculates the difference between old and new text based on selected mode
	 */
	function calculateDiff(): void {
		if (!oldText && !newText) {
			diffResult = [];
			return;
		}

		switch (mode) {
			case 'chars':
				diffResult = diffChars(oldText, newText);
				break;
			case 'words':
				diffResult = diffWords(oldText, newText);
				break;
			case 'lines':
				diffResult = diffLines(oldText, newText);
				break;
		}
	}

	/**
	 * Clears all inputs and results
	 */
	function clear(): void {
		oldText = '';
		newText = '';
		diffResult = [];
	}

	/**
	 * Syncs scroll position of old text line numbers
	 */
	function handleOldTextScroll(): void {
		if (oldTextLinesElement && oldTextElement) {
			oldTextLinesElement.scrollTop = oldTextElement.scrollTop;
		}
	}

	/**
	 * Syncs scroll position of new text line numbers
	 */
	function handleNewTextScroll(): void {
		if (newTextLinesElement && newTextElement) {
			newTextLinesElement.scrollTop = newTextElement.scrollTop;
		}
	}

	/**
	 * Syncs scroll position of output line numbers
	 */
	function handleOutputScroll(): void {
		if (outputLinesElement && outputElement) {
			outputLinesElement.scrollTop = outputElement.scrollTop;
		}
	}

	$effect(() => {
		if (oldText || newText || mode) calculateDiff();
	});

	let oldTextLineNumbers = $derived(oldText.split('\n').map((_, i) => i + 1));
	let newTextLineNumbers = $derived(newText.split('\n').map((_, i) => i + 1));
	
	let outputLineCount = $derived(() => {
		if (diffResult.length === 0) return 1;
		const text = diffResult.map(p => p.value).join('');
		return text.split('\n').length;
	});
	let outputLineNumbers = $derived(Array.from({ length: outputLineCount() }, (_, i) => i + 1));
</script>

<div class="grid h-[calc(100vh-18rem)] gap-4 lg:grid-cols-2">
	<!-- Inputs -->
	<div class="flex h-full min-h-0 flex-col gap-4">
		<div class="flex h-1/2 min-h-0 flex-col gap-2">
			<label for="original" class="text-sm font-medium text-muted-foreground">Original Text</label>
			<div class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/50 focus-within:ring-1 focus-within:ring-primary/30">
				<div
					bind:this={oldTextLinesElement}
					class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
					style="width: 3rem;"
				>
					{#each oldTextLineNumbers as line}
						<div class="px-2">{line}</div>
					{/each}
				</div>
				<textarea
					id="original"
					bind:this={oldTextElement}
					bind:value={oldText}
					onscroll={handleOldTextScroll}
					class="custom-scrollbar flex-1 resize-none bg-transparent p-4 font-mono text-sm whitespace-pre focus:outline-none"
					placeholder="Paste original text here..."
				></textarea>
			</div>
		</div>
		<div class="flex h-1/2 min-h-0 flex-col gap-2">
			<label for="modified" class="text-sm font-medium text-muted-foreground">Modified Text</label>
			<div class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/50 focus-within:ring-1 focus-within:ring-primary/30">
				<div
					bind:this={newTextLinesElement}
					class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
					style="width: 3rem;"
				>
					{#each newTextLineNumbers as line}
						<div class="px-2">{line}</div>
					{/each}
				</div>
				<textarea
					id="modified"
					bind:this={newTextElement}
					bind:value={newText}
					onscroll={handleNewTextScroll}
					class="custom-scrollbar flex-1 resize-none bg-transparent p-4 font-mono text-sm whitespace-pre focus:outline-none"
					placeholder="Paste modified text here..."
				></textarea>
			</div>
		</div>
	</div>

	<!-- Output -->
	<div class="flex h-full min-h-0 flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<span class="text-sm font-medium text-muted-foreground">Differences</span>
				<div class="flex rounded-md border bg-muted/50 p-1">
					<button
						class="rounded px-2 py-0.5 text-xs font-medium transition-colors {mode === 'chars' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
						onclick={() => (mode = 'chars')}
					>
						Chars
					</button>
					<button
						class="rounded px-2 py-0.5 text-xs font-medium transition-colors {mode === 'words' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
						onclick={() => (mode = 'words')}
					>
						Words
					</button>
					<button
						class="rounded px-2 py-0.5 text-xs font-medium transition-colors {mode === 'lines' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
						onclick={() => (mode = 'lines')}
					>
						Lines
					</button>
				</div>
			</div>
			<button 
				onclick={clear} 
				class="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
			>
				<Trash2 class="h-3 w-3" />
				Clear All
			</button>
		</div>

		<div class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/30">
			<div
				bind:this={outputLinesElement}
				class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
				style="width: 3rem;"
			>
				{#each outputLineNumbers as line}
					<div class="px-2">{line}</div>
				{/each}
			</div>
			<div 
				bind:this={outputElement}
				onscroll={handleOutputScroll}
				class="custom-scrollbar h-full flex-1 overflow-auto bg-transparent p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
			>
				{#each diffResult as part}
					<span
						class="{part.added ? 'bg-green-500/20 text-green-600 dark:text-green-400' : ''} {part.removed ? 'bg-red-500/20 text-red-600 dark:text-red-400 decoration-red-500/50 line-through' : ''}"
					>
						{part.value}
					</span>
				{/each}
				{#if diffResult.length === 0 && (oldText || newText)}
					<span class="text-muted-foreground italic">No differences found.</span>
				{/if}
				{#if !oldText && !newText}
					<span class="text-muted-foreground">Result will appear here...</span>
				{/if}
			</div>
		</div>
	</div>
</div>
