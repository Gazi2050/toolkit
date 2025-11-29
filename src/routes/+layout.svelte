<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Menu } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	
	let { children } = $props();
	let isSidebarOpen = $state(false);

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	// Close sidebar on navigation
	$effect(() => {
		if ($page.url.pathname) {
			isSidebarOpen = false;
		}
	});
</script>

<div class="min-h-screen bg-background font-sans antialiased">
	<!-- Mobile Header -->
	<div class="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden">
		<Button variant="ghost" size="icon" onclick={toggleSidebar}>
			<Menu class="h-5 w-5" />
			<span class="sr-only">Toggle menu</span>
		</Button>
		<span class="text-lg font-semibold">DevTools</span>
		<ThemeToggle />
	</div>

	<!-- Sidebar Overlay -->
	{#if isSidebarOpen}
		<div 
			class="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm sm:hidden"
			onclick={() => isSidebarOpen = false}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Escape' && (isSidebarOpen = false)}
		></div>
	{/if}

	<Sidebar class={isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} />
	
	<!-- Desktop Theme Toggle (Absolute position in sidebar area or header? Let's put it in main for now or update sidebar) -->
	<!-- Actually, let's put it in the top right of the main content for desktop -->
	
	<main class="p-4 sm:ml-64">
		<div class="mx-auto max-w-7xl p-4">
			<div class="mb-4 hidden justify-end sm:flex">
				<ThemeToggle />
			</div>
			{@render children()}
		</div>
	</main>
</div>
