<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { ArrowUpRight } from '@lucide/svelte';

	export let title: string;
	export let description: string;
	export let icon: any;
	export let href: string;
</script>

<a
	{href}
	class="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
>
	<div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
	<div class="relative z-10">
		<div class="mb-4 inline-flex rounded-lg bg-muted/50 p-3 text-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
			<svelte:component this={icon} class="h-6 w-6" />
		</div>
		<h3 class="mb-2 text-lg font-semibold tracking-tight text-foreground">
			{title}
			<ArrowUpRight class="ml-1 inline-block h-4 w-4 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
		</h3>
		<p class="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
			{description}
		</p>
	</div>
</a>
