<script lang="ts">
	import { Copy, Trash2, FileJson, Minimize, Maximize } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	
	let input = $state('');
	let output = $state('');
	let error = $state('');
	let mode: 'format' | 'minify' = $state('format');

	function formatJSON() {
		try {
			if (!input.trim()) {
				output = '';
				error = '';
				return;
			}
			const parsed = JSON.parse(input);
			output = JSON.stringify(parsed, null, 2);
			error = '';
			mode = 'format';
		} catch (e) {
			error = (e as Error).message;
			output = '';
		}
	}

	function minifyJSON() {
		try {
			if (!input.trim()) {
				output = '';
				error = '';
				return;
			}
			const parsed = JSON.parse(input);
			output = JSON.stringify(parsed);
			error = '';
			mode = 'minify';
		} catch (e) {
			error = (e as Error).message;
			output = '';
		}
	}

	function clear() {
		input = '';
		output = '';
		error = '';
	}

	function copyToClipboard() {
		if (output) {
			navigator.clipboard.writeText(output);
		}
	}
</script>

<div class="grid h-[calc(100vh-12rem)] gap-4 lg:grid-cols-2">
	<div class="flex h-full min-h-0 flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="json-input" class="text-sm font-medium text-muted-foreground">Input JSON</label>
			<div class="flex gap-2">
				<button class="text-xs text-muted-foreground hover:text-foreground" onclick={clear}>
					Clear
				</button>
			</div>
		</div>
		<textarea
			id="json-input"
			bind:value={input}
			class="custom-scrollbar flex-1 resize-none rounded-lg border bg-muted/50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
			placeholder="Paste your JSON here..."
		></textarea>
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
		<div class="relative flex-1 overflow-hidden rounded-lg border bg-muted/50">
			{#if error}
				<div class="absolute inset-0 p-4 text-red-500">
					Error: {error}
				</div>
			{:else}
				<pre class="custom-scrollbar h-full overflow-auto p-4 font-mono text-sm text-green-400">{output}</pre>
			{/if}
		</div>
	</div>
</div>

<div class="mt-4 flex gap-2">
	<Button onclick={formatJSON}>
		<Maximize class="mr-2 h-4 w-4" />
		Format
	</Button>
	<Button variant="outline" onclick={minifyJSON}>
		<Minimize class="mr-2 h-4 w-4" />
		Minify
	</Button>
</div>
