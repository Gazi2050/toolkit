<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let isDark = true;

	onMount(() => {
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

	/**
	 * Toggles the application theme between light and dark modes
	 * Updates local storage and DOM class list
	 */
	function toggleTheme(): void {
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

<button
	onclick={toggleTheme}
	class="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
	aria-label="Toggle theme"
>
	{#if isDark}
		<Moon class="h-5 w-5 transition-all" />
	{:else}
		<Sun class="h-5 w-5 transition-all" />
	{/if}
</button>
