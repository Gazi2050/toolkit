<script lang="ts">
	import ToolCard from '$lib/components/ToolCard.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
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
		Clock,
		Code2,
		ScanText,
		Zap
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
		},
		{
			title: 'Regex Tester',
			description: 'Create, test, and validate regular expressions with real-time feedback.',
			icon: Code2,
			href: '/regex-tester'
		},
		{
			title: 'Text Extractor',
			description: 'Extract text from images using OCR technology.',
			icon: ScanText,
			href: '/text-extractor'
		}
	];
</script>

<svelte:head>
	<title>ToolKit - Your Ultimate Developer Toolkit</title>
	<meta
		name="description"
		content="A collection of essential developer tools for JSON, text processing, encryption, and more."
	/>
</svelte:head>

<div class="flex min-h-[calc(100vh-8rem)] flex-col">
	<!-- Hero Section -->
	<div class="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
		<!-- Theme Toggle - Top Right -->
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

			<!-- Feature Badge -->
			<div class="mb-12 flex items-center justify-center">
				<div class="flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:border-primary/30 hover:bg-primary/10">
					<Zap class="h-4 w-4 text-primary" />
					<span>{tools.length} Tools Available</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Tools Grid -->
	<div class="px-4 pb-16">
		<div class="mx-auto max-w-7xl">
			<h2 class="mb-8 text-center text-2xl font-semibold">Available Tools</h2>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each tools as tool}
					<ToolCard {...tool} />
				{/each}
			</div>
		</div>
	</div>
</div>