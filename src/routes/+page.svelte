<script lang="ts">
	import ToolCard from '$lib/components/ToolCard.svelte';
	import {
		FileJson,
		GitCompare,
		CaseSensitive,
		Hash,
		FileText,
		Lock,
		ArrowRightLeft,
		Binary,
		Database,
		Image,
		QrCode,
		Type,
		Clock
	} from '@lucide/svelte';

	const tools = [
		{
			title: 'JSON Viewer',
			description: 'Format, validate, and minify JSON data with detailed error messages.',
			icon: FileJson,
			href: '/json-viewer'
		},
		{
			title: 'Text Compare',
			description: 'Compare two blocks of text and highlight the differences.',
			icon: GitCompare,
			href: '/text-compare'
		},
		{
			title: 'Text Encryption',
			description: 'Encode and decode text using Base64, Base32, and Base16.',
			icon: Lock,
			href: '/text-encryption'
		},
		{
			title: 'Number Base Converter',
			description: 'Convert numbers between binary, octal, decimal, and hexadecimal.',
			icon: Binary,
			href: '/number-base'
		}
	];
</script>

<div class="flex flex-col items-center justify-center py-10 text-center">
	<h1 class="text-gradient mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
		Your Ultimate Developer Toolkit
	</h1>
	<p class="mb-8 max-w-2xl text-lg text-muted-foreground">
		Unlock your productivity with tools designed for developers, by a developer.
	</p>
	<div class="mb-10 flex gap-4">
		<span class="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
			⚡ {tools.length} Tools
		</span>
		<span class="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
			🔒 Privacy First
		</span>
		<span class="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
			⌨️ Shortcuts
		</span>
	</div>
</div>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each tools as tool}
		<ToolCard {...tool} />
	{/each}
</div>