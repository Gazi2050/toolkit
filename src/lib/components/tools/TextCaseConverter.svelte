<script lang="ts">
	import { Copy, Check, RefreshCw, Type } from '@lucide/svelte';

	let input = $state('');
	let copiedId = $state<string | null>(null);

	/**
	 * Converts text to snake_case
	 */
	function toSnakeCase(str: string): string {
		return (
			str
				.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
				?.map((x) => x.toLowerCase())
				.join('_') || ''
		);
	}

	/**
	 * Converts text to camelCase
	 */
	function toCamelCase(str: string): string {
		return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
	}

	/**
	 * Converts text to kebab-case
	 */
	function toKebabCase(str: string): string {
		return (
			str
				.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
				?.map((x) => x.toLowerCase())
				.join('-') || ''
		);
	}

	/**
	 * Converts text to Title Case
	 */
	function toTitleCase(str: string): string {
		return str.replace(
			/\w\S*/g,
			(txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		);
	}

	/**
	 * Converts text to UPPERCASE
	 */
	function toUpperCase(str: string): string {
		return str.toUpperCase();
	}

	/**
	 * Converts text to lowercase
	 */
	function toLowerCase(str: string): string {
		return str.toLowerCase();
	}

	/**
	 * Copies text to clipboard
	 */
	function copyToClipboard(text: string, id: string): void {
		if (text) {
			navigator.clipboard.writeText(text);
			copiedId = id;
			setTimeout(() => (copiedId = null), 2000);
		}
	}

	/**
	 * Clears the input
	 */
	function clear(): void {
		input = '';
	}

	let snakeCase = $derived(toSnakeCase(input));
	let camelCase = $derived(toCamelCase(input));
	let kebabCase = $derived(toKebabCase(input));
	let titleCase = $derived(toTitleCase(input));
	let upperCase = $derived(toUpperCase(input));
	let lowerCase = $derived(toLowerCase(input));
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="input-text" class="text-sm font-medium text-muted-foreground">Input Text</label>
			<button
				onclick={clear}
				class="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
			>
				<RefreshCw class="h-3.5 w-3.5" />
				Clear
			</button>
		</div>
		<textarea
			id="input-text"
			bind:value={input}
			class="min-h-[120px] w-full resize-y rounded-lg border bg-muted/50 p-4 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30"
			placeholder="Enter text to convert..."
		></textarea>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<!-- snake_case -->
		<div
			class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-medium text-muted-foreground">snake_case</div>
				<button
					onclick={() => copyToClipboard(snakeCase, 'snake')}
					disabled={!snakeCase}
					class="rounded-md p-1.5 transition-colors hover:bg-background disabled:opacity-50"
					title="Copy"
				>
					{#if copiedId === 'snake'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-sm font-medium {snakeCase
					? 'text-foreground'
					: 'text-muted-foreground/50'}"
			>
				{snakeCase || 'example_text'}
			</div>
		</div>

		<!-- camelCase -->
		<div
			class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-medium text-muted-foreground">camelCase</div>
				<button
					onclick={() => copyToClipboard(camelCase, 'camel')}
					disabled={!camelCase}
					class="rounded-md p-1.5 transition-colors hover:bg-background disabled:opacity-50"
					title="Copy"
				>
					{#if copiedId === 'camel'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-sm font-medium {camelCase
					? 'text-foreground'
					: 'text-muted-foreground/50'}"
			>
				{camelCase || 'exampleText'}
			</div>
		</div>

		<!-- kebab-case -->
		<div
			class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-medium text-muted-foreground">kebab-case</div>
				<button
					onclick={() => copyToClipboard(kebabCase, 'kebab')}
					disabled={!kebabCase}
					class="rounded-md p-1.5 transition-colors hover:bg-background disabled:opacity-50"
					title="Copy"
				>
					{#if copiedId === 'kebab'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-sm font-medium {kebabCase
					? 'text-foreground'
					: 'text-muted-foreground/50'}"
			>
				{kebabCase || 'example-text'}
			</div>
		</div>

		<!-- Title Case -->
		<div
			class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-medium text-muted-foreground">Title Case</div>
				<button
					onclick={() => copyToClipboard(titleCase, 'title')}
					disabled={!titleCase}
					class="rounded-md p-1.5 transition-colors hover:bg-background disabled:opacity-50"
					title="Copy"
				>
					{#if copiedId === 'title'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-sm font-medium {titleCase
					? 'text-foreground'
					: 'text-muted-foreground/50'}"
			>
				{titleCase || 'Example Text'}
			</div>
		</div>

		<!-- UPPERCASE -->
		<div
			class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-medium text-muted-foreground">UPPERCASE</div>
				<button
					onclick={() => copyToClipboard(upperCase, 'upper')}
					disabled={!upperCase}
					class="rounded-md p-1.5 transition-colors hover:bg-background disabled:opacity-50"
					title="Copy"
				>
					{#if copiedId === 'upper'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-sm font-medium {upperCase
					? 'text-foreground'
					: 'text-muted-foreground/50'}"
			>
				{upperCase || 'EXAMPLE TEXT'}
			</div>
		</div>

		<!-- lowercase -->
		<div
			class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-medium text-muted-foreground">lowercase</div>
				<button
					onclick={() => copyToClipboard(lowerCase, 'lower')}
					disabled={!lowerCase}
					class="rounded-md p-1.5 transition-colors hover:bg-background disabled:opacity-50"
					title="Copy"
				>
					{#if copiedId === 'lower'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-sm font-medium {lowerCase
					? 'text-foreground'
					: 'text-muted-foreground/50'}"
			>
				{lowerCase || 'example text'}
			</div>
		</div>
	</div>
</div>
