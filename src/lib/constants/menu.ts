import {
	FileJson,
	GitCompare,
	Lock,
	Binary,
	Code2,
	ScanText,
	KeyRound,
	Type,
	Globe
} from '@lucide/svelte';
import type { MenuItem } from '$lib/types';

/**
 * Navigation menu items for the sidebar
 */
export const MENU_ITEMS: MenuItem[] = [
	{ title: 'JSON Viewer', href: '/json-viewer', icon: FileJson },
	{ title: 'Text Compare', href: '/text-compare', icon: GitCompare },
	{ title: 'Text Encryption', href: '/text-encryption', icon: Lock },
	{ title: 'Number Base Converter', href: '/number-base', icon: Binary },
	{ title: 'Regex Tester', href: '/regex-tester', icon: Code2 },
	{ title: 'Text Extractor', href: '/text-extractor', icon: ScanText },
	{ title: 'Password Generator', href: '/password-generator', icon: KeyRound },
	{ title: 'Text Case Converter', href: '/text-case-converter', icon: Type },
	{ title: 'Time Zone Converter', href: '/time-zone-converter', icon: Globe }
];
