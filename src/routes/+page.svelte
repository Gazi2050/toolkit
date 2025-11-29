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
			description: 'Easily view and format JSON data for better readability.',
			icon: FileJson,
			href: '/json-viewer'
		},
		{
			title: 'Text Compare',
			description: 'Compare two pieces of text to identify differences quickly.',
			icon: GitCompare,
			href: '/text-compare'
		},
		{
			title: 'Case Converter',
			description: 'Convert text between camelCase, snake_case, kebab-case and more.',
			icon: CaseSensitive,
			href: '/case-converter'
		},
		{
			title: 'Token Counter',
			description: 'Analyze text tokenization for AI models and calculate API costs.',
			icon: Hash,
			href: '/token-counter'
		},
		{
			title: 'Markdown Editor',
			description: 'Write, preview, and edit Markdown files with ease.',
			icon: FileText,
			href: '/markdown'
		},
		{
			title: 'Base64 Converter',
			description: 'Encode or decode Base64 strings effortlessly.',
			icon: Lock,
			href: '/base64'
		},
		{
			title: 'Text Encryption',
			description: 'Encode and decode text using Base64, Base32, and Base16.',
			icon: Lock,
			href: '/text-encryption'
		},
		{
			title: 'Number Base',
			description: 'Convert numbers between binary, octal, decimal, and hex.',
			icon: Binary,
			href: '/number-base'
		},
		{
			title: 'CSV to JSON',
			description: 'Convert between CSV and JSON formats with header support.',
			icon: Database,
			href: '/csv-json'
		},
		{
			title: 'Image Format',
			description: 'Convert images between PNG, JPEG, WebP, and BMP formats.',
			icon: Image,
			href: '/image-format'
		},
		{
			title: 'UUID Generator',
			description: 'Generate unique identifiers for your applications.',
			icon: Hash,
			href: '/uuid'
		},
		{
			title: 'QR Code Generator',
			description: 'Create and download QR codes for URLs and text.',
			icon: QrCode,
			href: '/qr-code'
		},
		{
			title: 'Hash Generator',
			description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.',
			icon: Lock,
			href: '/hash'
		},
		{
			title: 'Lorem Generator',
			description: 'Generate placeholder text for your designs.',
			icon: Type,
			href: '/lorem'
		},
		{
			title: 'Timestamp',
			description: 'Convert timestamps to human-readable dates and vice versa.',
			icon: Clock,
			href: '/timestamp'
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