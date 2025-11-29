<script lang="ts">
	import TextExtractor from '$lib/components/tools/TextExtractor.svelte';
	import { ScanText } from '@lucide/svelte';
</script>

<div class="flex flex-col">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<ScanText class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Text Extractor</h1>
			<p class="text-sm text-muted-foreground">Extract text from images using OCR technology.</p>
		</div>
	</div>

	<TextExtractor />
</div>
