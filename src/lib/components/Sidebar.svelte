<script lang="ts">
	import { page } from '$app/stores';
	import {
		Home,
		FileJson,
		GitCompare,
		CaseSensitive,
		Binary,
		Image,
		Regex,
		FileText,
		ArrowRightLeft,
		Hash,
		Clock,
		QrCode,
		Type,
		Lock,
		Database
	} from '@lucide/svelte';

	const menuItems = [
		{
			title: 'Home',
			items: [{ title: 'Home', href: '/', icon: Home }]
		},
		{
			title: 'Text & Content',
			items: [
				{ title: 'JSON Viewer', href: '/json-viewer', icon: FileJson },
				{ title: 'Text Compare', href: '/text-compare', icon: GitCompare },
				{ title: 'Case Converter', href: '/case-converter', icon: CaseSensitive },
				{ title: 'Token Counter', href: '/token-counter', icon: Hash },
				{ title: 'Markdown', href: '/markdown', icon: FileText }
			]
		},
		{
			title: 'Encoding & Conversion',
			items: [
				{ title: 'Base64 Converter', href: '/base64', icon: Lock },
				{ title: 'URL Encoder', href: '/url-encoder', icon: ArrowRightLeft },
				{ title: 'Number Base', href: '/number-base', icon: Binary },
				{ title: 'CSV to JSON', href: '/csv-json', icon: Database },
				{ title: 'Image Format', href: '/image-format', icon: Image }
			]
		},
		{
			title: 'Generators & Utilities',
			items: [
				{ title: 'UUID Generator', href: '/uuid', icon: Hash },
				{ title: 'QR Code', href: '/qr-code', icon: QrCode },
				{ title: 'Hash Generator', href: '/hash', icon: Lock },
				{ title: 'Lorem Generator', href: '/lorem', icon: Type },
				{ title: 'Timestamp', href: '/timestamp', icon: Clock }
			]
		}
	];
</script>

<aside class="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-card transition-transform sm:translate-x-0 {$$props.class || ''}">
	<div class="no-scrollbar flex h-full flex-col overflow-y-auto px-3 py-4">
		<a href="/" class="mb-5 flex items-center ps-2.5">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">DevTools</span>
		</a>
		<ul class="space-y-2 font-medium">
			{#each menuItems as group}
				{#if group.title !== 'Home'}
					<li class="mt-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						{group.title}
					</li>
				{/if}
				{#each group.items as item}
					<li>
						<a
							href={item.href}
							class="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground {$page.url.pathname === item.href ? 'bg-muted text-foreground' : ''}"
						>
							<item.icon class="mr-3 h-4 w-4 flex-shrink-0 transition-colors group-hover:text-foreground {$page.url.pathname === item.href ? 'text-foreground' : ''}" />
							<span>{item.title}</span>
						</a>
					</li>
				{/each}
			{/each}
		</ul>
	</div>
</aside>
