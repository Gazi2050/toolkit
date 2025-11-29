<script lang="ts">
	import ToolCard from '$lib/components/ToolCard.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Zap } from '@lucide/svelte';
	import { TOOLS } from '$lib/constants/tools';
</script>

<svelte:head>
	<title>ToolKit - Your Ultimate Developer Toolkit</title>
	<meta
		name="description"
		content="A collection of essential developer tools for JSON, text processing, encryption, and more."
	/>
</svelte:head>

<div class="flex min-h-[calc(100vh-8rem)] flex-col">
	<div class="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
		<div class="absolute right-8 top-8">
			<ThemeToggle />
		</div>

		<div class="mx-auto max-w-4xl">
			<h1 class="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-5xl">
				Your Ultimate Developer Toolkit
			</h1>
			<p class="mb-8 text-lg text-muted-foreground sm:text-xl">
				Unlock your productivity with tools designed for developers, by a developer.
			</p>

			<div class="mb-12 flex items-center justify-center">
				<div class="flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10">
					<Zap class="h-4 w-4 text-primary" />
					<span>{TOOLS.length} Tools Available</span>
				</div>
			</div>
		</div>
	</div>

	<div class="px-4 pb-16">
		<div class="mx-auto max-w-7xl">
			<h2 class="mb-8 text-center text-2xl font-semibold">Available Tools</h2>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each TOOLS as tool}
					<ToolCard {...tool} />
				{/each}
			</div>
		</div>
	</div>
</div>