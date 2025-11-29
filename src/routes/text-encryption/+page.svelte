<script lang="ts">
	import TextEncoder from '$lib/components/tools/TextEncoder.svelte';
	import { ArrowRightLeft } from '@lucide/svelte';
</script>

<div class="flex flex-col">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<ArrowRightLeft class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Text Encoder & Decoder</h1>
			<p class="text-sm text-muted-foreground">Encode and decode text using Base64, Base32, and Base16 (Hex).</p>
		</div>
	</div>

	<TextEncoder />
</div>
