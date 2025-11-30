<script lang="ts">
	import PasswordGenerator from '$lib/components/tools/PasswordGenerator.svelte';
</script>

<svelte:head>
	<title>Password Generator - ToolKit</title>
	<meta
		name="description"
		content="Generate secure passwords with customizable options including length, character types, and strength indicators."
	/>
</svelte:head>

<div class="flex h-full flex-col gap-4 overflow-hidden">
	<div class="flex-shrink-0">
		<h1 class="text-3xl font-bold tracking-tight">Password Generator</h1>
		<p class="mt-2 text-muted-foreground">
			Generate secure passwords with customizable options and strength indicators
		</p>
	</div>

	<div class="min-h-0 flex-1 overflow-hidden">
		<PasswordGenerator />
	</div>
</div>
