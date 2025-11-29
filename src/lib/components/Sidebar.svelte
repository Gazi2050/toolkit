<script lang="ts">
	import { page } from '$app/stores';
	import { MENU_ITEMS } from '$lib/constants/menu';
</script>

<aside class="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-card transition-transform sm:translate-x-0 {$$props.class || ''}">
	<div class="flex h-full flex-col overflow-y-auto px-3 py-4">
		<a href="/" class="mb-5 flex items-center gap-2 px-2">
			<div class="text-gradient text-xl font-bold">ToolKit</div>
		</a>

		<nav class="flex-1 space-y-1">
			{#each MENU_ITEMS as item}
				<a
					href={item.href}
					class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground {$page.url.pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}"
				>
					<svelte:component this={item.icon} class="h-4 w-4" />
					<span>{item.title}</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>
