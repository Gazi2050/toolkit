<script lang="ts">
	import { diffChars, diffLines, diffWords } from 'diff';
	import { Button } from '$lib/components/ui/button';
	import { Copy, Trash2, GitCompare } from '@lucide/svelte'; // Note: lucide-svelte import fixed in previous step but just to be safe

	let oldText = $state('');
	let newText = $state('');
	let diffResult: any[] = $state([]);
	let mode: 'chars' | 'words' | 'lines' = $state('chars');

	function calculateDiff() {
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

	function clear() {
		oldText = '';
		newText = '';
		diffResult = [];
	}

	// Recalculate when inputs or mode change
	$effect(() => {
		if (oldText || newText || mode) calculateDiff();
	});
</script>

<div class="grid h-[calc(100vh-14rem)] gap-4 lg:grid-cols-2">
	<!-- Inputs -->
	<div class="flex flex-col gap-4">
		<div class="flex h-1/2 flex-col gap-2">
			<label for="original" class="text-sm font-medium text-muted-foreground">Original Text</label>
			<textarea
				id="original"
				bind:value={oldText}
				class="flex-1 resize-none rounded-lg border bg-muted/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				placeholder="Paste original text here..."
			></textarea>
		</div>
		<div class="flex h-1/2 flex-col gap-2">
			<label for="modified" class="text-sm font-medium text-muted-foreground">Modified Text</label>
			<textarea
				id="modified"
				bind:value={newText}
				class="flex-1 resize-none rounded-lg border bg-muted/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				placeholder="Paste modified text here..."
			></textarea>
		</div>
	</div>

	<!-- Output -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
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
			<Button variant="ghost" size="sm" onclick={clear} class="h-8 text-xs">
				<Trash2 class="mr-2 h-3 w-3" />
				Clear All
			</Button>
		</div>

		<div class="relative flex-1 overflow-hidden rounded-lg border bg-muted/30">
			<div class="h-full overflow-auto p-4 font-mono text-sm leading-relaxed">
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
