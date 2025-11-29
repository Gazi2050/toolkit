<script lang="ts">
	import TextCompare from '$lib/components/tools/TextCompare.svelte';
	import { GitCompare } from '@lucide/svelte';
</script>

<div class="flex flex-col">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<GitCompare class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Text Compare</h1>
			<p class="text-sm text-muted-foreground">Compare two blocks of text and highlight the differences.</p>
		</div>
	</div>

	<TextCompare />
</div>
