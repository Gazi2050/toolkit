<script lang="ts">
	import TimeZoneConverter from '$lib/components/tools/TimeZoneConverter.svelte';
	import { Globe } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Time Zone Converter - ToolKit</title>
	<meta
		name="description"
		content="Convert times between global time zones in a clean, developer-friendly format (ISO, UTC offsets, etc.)."
	/>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<Globe class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Time Zone Converter</h1>
			<p class="text-sm text-muted-foreground">
				Convert times between global time zones in a clean, developer-friendly format
			</p>
		</div>
	</div>

	<TimeZoneConverter />
</div>
