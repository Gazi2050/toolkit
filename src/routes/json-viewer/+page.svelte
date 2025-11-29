<script lang="ts">
	import JsonViewer from '$lib/components/tools/JsonViewer.svelte';
	import { FileJson } from '@lucide/svelte';
</script>

<div class="flex h-full flex-col">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<FileJson class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">JSON Viewer</h1>
			<p class="text-sm text-muted-foreground">Format, validate, and minify JSON data.</p>
		</div>
	</div>

	<JsonViewer />
</div>
