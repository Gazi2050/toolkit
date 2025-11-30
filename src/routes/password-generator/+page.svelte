<script lang="ts">
	import PasswordGenerator from '$lib/components/tools/PasswordGenerator.svelte';
	import { KeyRound } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Password Generator - ToolKit</title>
	<meta
		name="description"
		content="Generate secure passwords with customizable options including length, character types, and strength indicators."
	/>
</svelte:head>

<div class="flex flex-col">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<KeyRound class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Password Generator</h1>
			<p class="text-sm text-muted-foreground">
				Generate secure passwords with customizable options and strength indicators
			</p>
		</div>
	</div>

	<PasswordGenerator />
</div>
