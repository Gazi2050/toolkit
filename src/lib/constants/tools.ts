import { FileJson, GitCompare, Lock, Binary, Code2, ScanText } from '@lucide/svelte';
import type { Tool } from '$lib/types';

/**
 * Available tools in the toolkit
 */
export const TOOLS: Tool[] = [
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
