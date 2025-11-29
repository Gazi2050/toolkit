<script lang="ts">
	import { ArrowRightLeft, Copy, Trash2 } from '@lucide/svelte';

	let input = $state('');
	let output = $state('');
	let error = $state<{ message: string; details?: string } | null>(null);
	let mode: 'encode' | 'decode' = $state('encode');
	let method: 'base64' | 'base32' | 'base16' = $state('base64');

	let inputElement = $state<HTMLTextAreaElement | null>(null);
	let inputLinesElement = $state<HTMLDivElement | null>(null);
	let outputElement = $state<HTMLPreElement | null>(null);
	let outputLinesElement = $state<HTMLDivElement | null>(null);

	const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

	/**
	 * Encodes a string to Base32
	 * @param str - The input string
	 */
	function base32Encode(str: string): string {
		const bytes = new TextEncoder().encode(str);
		let bits = '';
		for (const byte of bytes) {
			bits += byte.toString(2).padStart(8, '0');
		}
		
		let result = '';
		for (let i = 0; i < bits.length; i += 5) {
			const chunk = bits.slice(i, i + 5).padEnd(5, '0');
			result += BASE32_ALPHABET[parseInt(chunk, 2)];
		}
		
		while (result.length % 8 !== 0) {
			result += '=';
		}
		return result;
	}

	/**
	 * Decodes a Base32 string
	 * @param str - The Base32 string
	 */
	function base32Decode(str: string): string {
		str = str.toUpperCase().replace(/=+$/, '');
		let bits = '';
		
		for (const char of str) {
			const index = BASE32_ALPHABET.indexOf(char);
			if (index === -1) throw new Error(`Invalid Base32 character: '${char}'`);
			bits += index.toString(2).padStart(5, '0');
		}
		
		const bytes: number[] = [];
		for (let i = 0; i < bits.length; i += 8) {
			if (i + 8 <= bits.length) {
				bytes.push(parseInt(bits.slice(i, i + 8), 2));
			}
		}
		
		return new TextDecoder().decode(new Uint8Array(bytes));
	}

	/**
	 * Encodes a string to Hex (Base16)
	 * @param str - The input string
	 */
	function hexEncode(str: string): string {
		return Array.from(new TextEncoder().encode(str))
			.map(byte => byte.toString(16).padStart(2, '0'))
			.join('');
	}

	/**
	 * Decodes a Hex (Base16) string
	 * @param str - The Hex string
	 */
	function hexDecode(str: string): string {
		const hex = str.replace(/\s/g, '');
		if (hex.length % 2 !== 0) {
			throw new Error('Invalid hex string: length must be even');
		}
		
		const bytes: number[] = [];
		for (let i = 0; i < hex.length; i += 2) {
			const byte = parseInt(hex.slice(i, i + 2), 16);
			if (isNaN(byte)) {
				throw new Error(`Invalid hex characters at position ${i}`);
			}
			bytes.push(byte);
		}
		return new TextDecoder().decode(new Uint8Array(bytes));
	}

	/**
	 * Processes the input based on selected mode and method
	 */
	function process(): void {
		try {
			if (!input.trim()) {
				output = '';
				error = null;
				return;
			}

			if (mode === 'encode') {
				switch (method) {
					case 'base64':
						output = btoa(input);
						break;
					case 'base16':
						output = hexEncode(input);
						break;
					case 'base32':
						output = base32Encode(input);
						break;
				}
			} else {
				switch (method) {
					case 'base64':
						try {
							output = atob(input.trim());
						} catch {
							throw new Error('Invalid Base64 string. Check for invalid characters or incorrect padding.');
						}
						break;
					case 'base16':
						output = hexDecode(input);
						break;
					case 'base32':
						output = base32Decode(input);
						break;
				}
			}
			error = null;
		} catch (e) {
			const err = e as Error;
			error = {
				message: err.message,
				details: `Failed to ${mode} using ${method.toUpperCase()}`
			};
			output = '';
		}
	}

	/**
	 * Clears all input, output, and error states
	 */
	function clear(): void {
		input = '';
		output = '';
		error = null;
	}

	/**
	 * Copies the output content to clipboard
	 */
	function copyToClipboard(): void {
		if (output) {
			navigator.clipboard.writeText(output);
		}
	}

	/**
	 * Swaps input and output values and toggles mode
	 */
	function swap(): void {
		const temp = input;
		input = output;
		output = temp;
		mode = mode === 'encode' ? 'decode' : 'encode';
	}

	/**
	 * Syncs scroll position of input line numbers
	 */
	function handleInputScroll(): void {
		if (inputLinesElement && inputElement) {
			inputLinesElement.scrollTop = inputElement.scrollTop;
		}
	}

	/**
	 * Syncs scroll position of output line numbers
	 */
	function handleOutputScroll(): void {
		if (outputLinesElement && outputElement) {
			outputLinesElement.scrollTop = outputElement.scrollTop;
		}
	}

	$effect(() => {
		if (input || method || mode) process();
	});

	let inputLineNumbers = $derived(input.split('\n').map((_, i) => i + 1));
	let outputLineNumbers = $derived(output.split('\n').map((_, i) => i + 1));
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center gap-3">
		<div class="flex rounded-md border bg-muted/50 p-1">
			<button
				class="rounded px-3 py-1.5 text-sm font-medium transition-colors {mode === 'encode' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (mode = 'encode')}
			>
				Encode
			</button>
			<button
				class="rounded px-3 py-1.5 text-sm font-medium transition-colors {mode === 'decode' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
				onclick={() => (mode = 'decode')}
			>
				Decode
			</button>
		</div>

		<div class="relative">
			<select
				bind:value={method}
				class="appearance-none rounded-md border bg-background px-4 py-1.5 pr-10 text-sm font-medium shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary/30"
			>
				<option value="base64">Base64</option>
				<option value="base32">Base32</option>
				<option value="base16">Base16 (Hex)</option>
			</select>
			<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</div>

		<button
			onclick={swap}
			class="inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
			title="Swap input and output"
		>
			<ArrowRightLeft class="h-4 w-4" />
			Swap
		</button>

		<button
			onclick={clear}
			class="inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
		>
			<Trash2 class="h-4 w-4" />
			Clear
		</button>
	</div>

	<div class="grid h-[calc(100vh-20rem)] gap-4 lg:grid-cols-2">
		<div class="flex h-full min-h-0 flex-col gap-2">
			<label for="input-text" class="text-sm font-medium text-muted-foreground">
				Input {mode === 'encode' ? '(Plain Text)' : '(Encoded Text)'}
			</label>
			<div class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/50 focus-within:ring-1 focus-within:ring-primary/30">
				<div
					bind:this={inputLinesElement}
					class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
					style="width: 3rem;"
				>
					{#each inputLineNumbers as line}
						<div class="px-2">{line}</div>
					{/each}
				</div>
				<textarea
					id="input-text"
					bind:this={inputElement}
					bind:value={input}
					onscroll={handleInputScroll}
					class="custom-scrollbar flex-1 resize-none bg-transparent p-4 font-mono text-sm whitespace-pre focus:outline-none"
					placeholder="Enter text to {mode}..."
				></textarea>
			</div>
		</div>

		<div class="flex h-full min-h-0 flex-col gap-2">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-muted-foreground">
					Output {mode === 'encode' ? '(Encoded Text)' : '(Plain Text)'}
				</span>
				<button
					class="rounded-md p-1 hover:bg-muted"
					onclick={copyToClipboard}
					title="Copy to clipboard"
				>
					<Copy class="h-4 w-4" />
				</button>
			</div>
			<div class="relative flex flex-1 overflow-hidden rounded-lg border bg-muted/50">
				{#if error}
					<div class="absolute inset-0 overflow-auto p-4 text-red-500">
						<div class="mb-2 flex items-center gap-2 font-semibold">
							<div class="h-2 w-2 rounded-full bg-red-500"></div>
							{mode === 'encode' ? 'Encoding' : 'Decoding'} Error
						</div>
						<p class="mb-2 text-sm opacity-90">{error.message}</p>
						{#if error.details}
							<p class="text-xs text-red-400">{error.details}</p>
						{/if}
					</div>
				{:else}
					<div
						bind:this={outputLinesElement}
						class="hidden select-none overflow-hidden border-r bg-muted/30 py-4 text-right font-mono text-sm text-muted-foreground sm:block"
						style="width: 3rem;"
					>
						{#each outputLineNumbers as line}
							<div class="px-2">{line}</div>
						{/each}
					</div>
					<pre
						bind:this={outputElement}
						onscroll={handleOutputScroll}
						class="custom-scrollbar h-full flex-1 overflow-auto bg-transparent p-4 font-mono text-sm text-green-400 whitespace-pre"
					>{output}</pre>
				{/if}
			</div>
		</div>
	</div>
</div>
