<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	let isDark = true;

	onMount(() => {
		// Check initial preference
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			isDark = true;
			document.documentElement.classList.add('dark');
		} else {
			isDark = false;
			document.documentElement.classList.remove('dark');
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}
</script>

<Button variant="ghost" size="icon" onclick={toggleTheme} class="rounded-full">
	{#if isDark}
		<Moon class="h-5 w-5 transition-all" />
	{:else}
		<Sun class="h-5 w-5 transition-all" />
	{/if}
	<span class="sr-only">Toggle theme</span>
</Button>
