<script lang="ts">
	import NumberBaseConverter from '$lib/components/tools/NumberBaseConverter.svelte';
	import { Binary } from '@lucide/svelte';
</script>

<div class="flex flex-col">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<Binary class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Number Base Converter</h1>
			<p class="text-sm text-muted-foreground">
				Convert numbers between binary, octal, decimal, hexadecimal, or custom bases.
			</p>
		</div>
	</div>

	<NumberBaseConverter />
</div>
