<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';
	import { convertNumber } from './utils/numberBase';
	import { copyToClipboard } from './utils/copy';

	let inputValue = $state('');
	let inputBase: 2 | 8 | 10 | 16 = $state(10);
	let error = $state<string | null>(null);
	let copiedId = $state<string | null>(null);

	let binary = $state('');
	let octal = $state('');
	let decimal = $state('');
	let hexadecimal = $state('');

	function convert(): void {
		if (!inputValue.trim()) {
			binary = '';
			octal = '';
			decimal = '';
			hexadecimal = '';
			error = null;
			return;
		}

		// Check validity first by converting to decimal
		const check = convertNumber(inputValue, inputBase, 10);
		if (check.error) {
			error = check.error;
			binary = '';
			octal = '';
			decimal = '';
			hexadecimal = '';
			return;
		}

		binary = convertNumber(inputValue, inputBase, 2).converted;
		octal = convertNumber(inputValue, inputBase, 8).converted;
		decimal = convertNumber(inputValue, inputBase, 10).converted;
		hexadecimal = convertNumber(inputValue, inputBase, 16).converted;
		error = null;
	}

	async function copy(text: string, id: string) {
		await copyToClipboard(text);
		copiedId = id;
		setTimeout(() => (copiedId = null), 2000);
	}

	function clear(): void {
		inputValue = '';
		binary = '';
		octal = '';
		decimal = '';
		hexadecimal = '';
		error = null;
	}

	function setSample(): void {
		inputValue = '168898';
		inputBase = 10;
		convert();
	}

	$effect(() => {
		if (inputValue || inputBase) convert();
	});
</script>

<div class="flex flex-col gap-6">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<label for="base-select" class="text-sm font-medium text-muted-foreground">From:</label>
			<div class="relative">
				<select
					id="base-select"
					bind:value={inputBase}
					class="appearance-none rounded-md border bg-background px-4 py-1.5 pr-10 text-sm font-medium shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary/30"
				>
					<option value={10}>Decimal</option>
					<option value={2}>Binary</option>
					<option value={8}>Octal</option>
					<option value={16}>Hexadecimal</option>
				</select>
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</div>
		</div>
		<div class="flex gap-2">
			<button
				onclick={setSample}
				class="rounded-md border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary/30"
			>
				Sample
			</button>
			<button
				onclick={clear}
				class="rounded-md border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary/30"
			>
				Clear
			</button>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<label for="input-number" class="text-sm font-medium text-muted-foreground">
			Input (Base {inputBase})
		</label>
		<input
			id="input-number"
			type="text"
			bind:value={inputValue}
			class="rounded-lg border bg-muted/50 px-4 py-3 font-mono text-lg transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30 {error
				? 'border-red-500/50 focus:ring-red-500/30'
				: ''}"
			placeholder="Enter number..."
		/>
		{#if error}
			<p class="text-sm text-red-500">{error}</p>
		{/if}
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-sm font-medium text-muted-foreground">Binary (Base 2)</div>
					<div class="text-xs text-muted-foreground/70">0-1</div>
				</div>
				<button
					onclick={() => copy(binary, 'binary')}
					class="rounded-md p-1.5 transition-colors hover:bg-muted"
					title="Copy"
					disabled={!binary}
				>
					{#if copiedId === 'binary'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-lg font-semibold {binary
					? 'text-foreground'
					: 'text-muted-foreground'}"
			>
				{binary || '—'}
			</div>
		</div>

		<div class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-sm font-medium text-muted-foreground">Octal (Base 8)</div>
					<div class="text-xs text-muted-foreground/70">0-7</div>
				</div>
				<button
					onclick={() => copy(octal, 'octal')}
					class="rounded-md p-1.5 transition-colors hover:bg-muted"
					title="Copy"
					disabled={!octal}
				>
					{#if copiedId === 'octal'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-lg font-semibold {octal
					? 'text-foreground'
					: 'text-muted-foreground'}"
			>
				{octal || '—'}
			</div>
		</div>

		<div class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-sm font-medium text-muted-foreground">Decimal (Base 10)</div>
					<div class="text-xs text-muted-foreground/70">0-9</div>
				</div>
				<button
					onclick={() => copy(decimal, 'decimal')}
					class="rounded-md p-1.5 transition-colors hover:bg-muted"
					title="Copy"
					disabled={!decimal}
				>
					{#if copiedId === 'decimal'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-lg font-semibold {decimal
					? 'text-foreground'
					: 'text-muted-foreground'}"
			>
				{decimal || '—'}
			</div>
		</div>

		<div class="flex flex-col gap-2 rounded-lg border bg-muted/30 p-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="text-sm font-medium text-muted-foreground">Hexadecimal (Base 16)</div>
					<div class="text-xs text-muted-foreground/70">0-9, A-F</div>
				</div>
				<button
					onclick={() => copy(hexadecimal, 'hexadecimal')}
					class="rounded-md p-1.5 transition-colors hover:bg-muted"
					title="Copy"
					disabled={!hexadecimal}
				>
					{#if copiedId === 'hexadecimal'}
						<Check class="h-4 w-4 text-green-500" />
					{:else}
						<Copy class="h-4 w-4" />
					{/if}
				</button>
			</div>
			<div
				class="break-all font-mono text-lg font-semibold {hexadecimal
					? 'text-foreground'
					: 'text-muted-foreground'}"
			>
				{hexadecimal || '—'}
			</div>
		</div>
	</div>

	<div class="rounded-lg border bg-muted/20 p-4">
		<h3 class="mb-3 text-sm font-semibold">Quick Reference:</h3>
		<div class="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
			<div>
				<span class="font-semibold">Binary (Base 2)</span>
				<div class="text-muted-foreground">Uses: 0-1</div>
			</div>
			<div>
				<span class="font-semibold">Octal (Base 8)</span>
				<div class="text-muted-foreground">Uses: 0-7</div>
			</div>
			<div>
				<span class="font-semibold">Decimal (Base 10)</span>
				<div class="text-muted-foreground">Uses: 0-9</div>
			</div>
			<div>
				<span class="font-semibold">Hexadecimal (Base 16)</span>
				<div class="text-muted-foreground">Uses: 0-9, A-F</div>
			</div>
		</div>
	</div>
</div>
