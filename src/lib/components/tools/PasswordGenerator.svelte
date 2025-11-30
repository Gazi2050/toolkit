<script lang="ts">
	import { Copy, RefreshCw, Trash2, Shield, Check, Eye, EyeOff } from '@lucide/svelte';

	let mode: 'generate' | 'test' = $state('generate');
	let password = $state('');
	let testPassword = $state('');
	let showTestPassword = $state(false);
	let length = $state(16);
	let includeUppercase = $state(true);
	let includeLowercase = $state(true);
	let includeNumbers = $state(true);
	let includeSymbols = $state(true);
	let excludeSimilar = $state(false);
	let excludeAmbiguous = $state(false);
	let passwordHistory = $state<string[]>([]);
	let copied = $state(false);

	const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
	const NUMBERS = '0123456789';
	const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
	const SIMILAR_CHARS = 'il1Lo0O';
	const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

	/**
	 * Calculates password strength based on length and character variety
	 */
	function calculateStrength(pwd: string): {
		score: number;
		label: string;
		color: string;
		percentage: number;
	} {
		if (!pwd) return { score: 0, label: 'None', color: 'bg-muted', percentage: 0 };

		let score = 0;
		if (pwd.length >= 8) score += 1;
		if (pwd.length >= 12) score += 1;
		if (pwd.length >= 16) score += 1;
		if (/[a-z]/.test(pwd)) score += 1;
		if (/[A-Z]/.test(pwd)) score += 1;
		if (/[0-9]/.test(pwd)) score += 1;
		if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

		const percentage = Math.round((score / 7) * 100);

		if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500', percentage };
		if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-orange-500', percentage };
		if (score <= 5) return { score: 3, label: 'Good', color: 'bg-yellow-500', percentage };
		if (score <= 6) return { score: 4, label: 'Strong', color: 'bg-green-500', percentage };
		return { score: 5, label: 'Very Strong', color: 'bg-green-600', percentage };
	}

	/**
	 * Generates a random password based on selected options
	 */
	function generatePassword(): void {
		let charset = '';

		if (includeUppercase) charset += UPPERCASE;
		if (includeLowercase) charset += LOWERCASE;
		if (includeNumbers) charset += NUMBERS;
		if (includeSymbols) charset += SYMBOLS;

		if (!charset) {
			charset = LOWERCASE;
			includeLowercase = true;
		}

		if (excludeSimilar) {
			charset = charset
				.split('')
				.filter((char) => !SIMILAR_CHARS.includes(char))
				.join('');
		}

		if (excludeAmbiguous) {
			charset = charset
				.split('')
				.filter((char) => !AMBIGUOUS_CHARS.includes(char))
				.join('');
		}

		let newPassword = '';
		const array = new Uint32Array(length);
		crypto.getRandomValues(array);

		for (let i = 0; i < length; i++) {
			newPassword += charset[array[i] % charset.length];
		}

		password = newPassword;

		if (password && !passwordHistory.includes(password)) {
			passwordHistory = [password, ...passwordHistory].slice(0, 5);
		}
	}

	/**
	 * Copies password to clipboard
	 */
	async function copyToClipboard(text: string): Promise<void> {
		if (text) {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	/**
	 * Clears password and history
	 */
	function clear(): void {
		password = '';
		testPassword = '';
		passwordHistory = [];
	}

	// Debounce timer
	let generateTimer: ReturnType<typeof setTimeout>;

	function debouncedGenerate() {
		clearTimeout(generateTimer);
		generateTimer = setTimeout(() => {
			generatePassword();
		}, 150);
	}

	function getSuggestions(pwd: string): string[] {
		const suggestions: string[] = [];
		if (!pwd) return [];
		if (pwd.length < 8) suggestions.push('Too short (min 8)');
		if (!/[a-z]/.test(pwd)) suggestions.push('Add lowercase');
		if (!/[A-Z]/.test(pwd)) suggestions.push('Add uppercase');
		if (!/[0-9]/.test(pwd)) suggestions.push('Add numbers');
		if (!/[^a-zA-Z0-9]/.test(pwd)) suggestions.push('Add symbols');
		return suggestions;
	}

	let activePassword = $derived(mode === 'generate' ? password : testPassword);
	let strength = $derived(calculateStrength(activePassword));
	let suggestions = $derived(mode === 'test' ? getSuggestions(testPassword) : []);

	$effect(() => {
		// Track dependencies
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _deps = [
			length,
			includeUppercase,
			includeLowercase,
			includeNumbers,
			includeSymbols,
			excludeSimilar,
			excludeAmbiguous
		];

		if (mode === 'generate') {
			debouncedGenerate();
		}
	});

	// Initial generation
	$effect(() => {
		if (!password) generatePassword();
	});
</script>

<div class="flex h-full flex-col gap-4">
	<!-- Mode Tabs -->
	<div class="flex gap-2 rounded-lg border bg-card p-1">
		<button
			onclick={() => (mode = 'generate')}
			class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors {mode === 'generate'
				? 'bg-primary text-primary-foreground shadow-sm'
				: 'text-muted-foreground hover:text-foreground'}"
		>
			Generate Password
		</button>
		<button
			onclick={() => (mode = 'test')}
			class="flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors {mode === 'test'
				? 'bg-primary text-primary-foreground shadow-sm'
				: 'text-muted-foreground hover:text-foreground'}"
		>
			Test Password
		</button>
	</div>

	<!-- Password Display/Input -->
	<div
		class="flex flex-col gap-3 rounded-xl border bg-gradient-to-br from-card to-card/50 p-4 shadow-sm"
	>
		<div class="flex items-center justify-between">
			<h3 class="text-base font-semibold">
				{mode === 'generate' ? 'Generated Password' : 'Test Your Password'}
			</h3>
			<div class="flex items-center gap-2 rounded-full bg-muted/50 px-2.5 py-0.5">
				<Shield class="h-3.5 w-3.5 {strength.color.replace('bg-', 'text-')}" />
				<span class="text-xs font-medium">{strength.label}</span>
			</div>
		</div>

		<div class="relative">
			<div class:hidden={mode !== 'generate'}>
				<input
					type="text"
					readonly
					value={password}
					class="w-full rounded-lg border-2 bg-muted/30 px-3 py-3 pr-20 font-mono text-base font-semibold focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
					placeholder="Click generate to create password"
				/>
				<div class="absolute right-1.5 top-1/2 flex -translate-y-1/2 gap-0.5">
					<button
						onclick={() => copyToClipboard(password)}
						disabled={!password}
						class="rounded-md p-1.5 hover:bg-background disabled:opacity-50"
						title="Copy password"
					>
						{#if copied}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
					<button
						onclick={generatePassword}
						class="rounded-md p-1.5 hover:bg-background"
						title="Generate new password"
					>
						<RefreshCw class="h-4 w-4" />
					</button>
				</div>
			</div>

			<div class:hidden={mode !== 'test'}>
				<input
					type={showTestPassword ? 'text' : 'password'}
					bind:value={testPassword}
					class="w-full rounded-lg border-2 bg-muted/30 px-3 py-3 pr-20 font-mono text-base font-semibold focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
					placeholder="Type your password to test its strength..."
				/>
				<div class="absolute right-1.5 top-1/2 flex -translate-y-1/2 gap-0.5">
					<button
						onclick={() => (showTestPassword = !showTestPassword)}
						class="rounded-md p-1.5 hover:bg-background"
						title={showTestPassword ? 'Hide password' : 'Show password'}
					>
						{#if showTestPassword}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</button>
					<button
						onclick={() => copyToClipboard(testPassword)}
						disabled={!testPassword}
						class="rounded-md p-1.5 hover:bg-background disabled:opacity-50"
						title="Copy password"
					>
						{#if copied}
							<Check class="h-4 w-4 text-green-500" />
						{:else}
							<Copy class="h-4 w-4" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<!-- Strength Bar & Suggestions -->
		<div class="space-y-1.5">
			<div class="flex items-center justify-between text-xs">
				<span class="text-muted-foreground">Strength</span>
				<span class="font-medium">{strength.percentage}%</span>
			</div>
			<div class="h-1.5 overflow-hidden rounded-full bg-muted">
				<div
					class="h-full transition-all duration-300 {strength.color}"
					style="width: {strength.percentage}%"
				></div>
			</div>

			{#if suggestions.length > 0}
				<div class="mt-2 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1">
					{#each suggestions as suggestion (suggestion)}
						<span
							class="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500 border border-red-500/20"
						>
							{suggestion}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<div class="grid min-h-0 flex-1 gap-4 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
		<!-- Options Panel -->
		<div
			class="flex min-h-0 flex-col gap-4 rounded-xl border bg-card p-4 transition-opacity duration-200 lg:overflow-y-auto {mode ===
			'generate'
				? 'opacity-100'
				: 'pointer-events-none opacity-50 grayscale'}"
		>
			<h3 class="text-base font-semibold">Customization</h3>

			<!-- Length Slider -->
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<label for="length" class="text-xs font-medium">Password Length</label>
					<span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
						{length}
					</span>
				</div>
				<input
					id="length"
					type="range"
					min="4"
					max="64"
					bind:value={length}
					disabled={mode !== 'generate'}
					class="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
					style="--progress: {((length - 4) / 60) *
						100}%; background: linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) var(--progress), hsl(var(--muted)) var(--progress), hsl(var(--muted)) 100%)"
				/>
				<div class="flex justify-between text-xs text-muted-foreground">
					<span>4</span>
					<span>64</span>
				</div>
			</div>

			<!-- Character Types -->
			<div class="space-y-2">
				<p class="text-xs font-medium">Include Characters</p>
				<div class="grid gap-2">
					<label
						class="group flex cursor-pointer items-center gap-2.5 rounded-lg border bg-muted/30 p-2.5 transition-colors hover:bg-muted/50 {includeUppercase
							? 'border-primary/50 bg-primary/5'
							: ''}"
					>
						<input
							type="checkbox"
							bind:checked={includeUppercase}
							disabled={mode !== 'generate'}
							class="h-4 w-4 cursor-pointer rounded border-2 border-muted-foreground/30 bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
						/>
						<div class="flex-1">
							<span class="text-xs font-medium">Uppercase Letters</span>
							<span class="ml-1.5 text-xs text-muted-foreground">(A-Z)</span>
						</div>
					</label>

					<label
						class="group flex cursor-pointer items-center gap-2.5 rounded-lg border bg-muted/30 p-2.5 transition-colors hover:bg-muted/50 {includeLowercase
							? 'border-primary/50 bg-primary/5'
							: ''}"
					>
						<input
							type="checkbox"
							bind:checked={includeLowercase}
							disabled={mode !== 'generate'}
							class="h-4 w-4 cursor-pointer rounded border-2 border-muted-foreground/30 bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
						/>
						<div class="flex-1">
							<span class="text-xs font-medium">Lowercase Letters</span>
							<span class="ml-1.5 text-xs text-muted-foreground">(a-z)</span>
						</div>
					</label>

					<label
						class="group flex cursor-pointer items-center gap-2.5 rounded-lg border bg-muted/30 p-2.5 transition-colors hover:bg-muted/50 {includeNumbers
							? 'border-primary/50 bg-primary/5'
							: ''}"
					>
						<input
							type="checkbox"
							bind:checked={includeNumbers}
							disabled={mode !== 'generate'}
							class="h-4 w-4 cursor-pointer rounded border-2 border-muted-foreground/30 bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
						/>
						<div class="flex-1">
							<span class="text-xs font-medium">Numbers</span>
							<span class="ml-1.5 text-xs text-muted-foreground">(0-9)</span>
						</div>
					</label>

					<label
						class="group flex cursor-pointer items-center gap-2.5 rounded-lg border bg-muted/30 p-2.5 transition-colors hover:bg-muted/50 {includeSymbols
							? 'border-primary/50 bg-primary/5'
							: ''}"
					>
						<input
							type="checkbox"
							bind:checked={includeSymbols}
							disabled={mode !== 'generate'}
							class="h-4 w-4 cursor-pointer rounded border-2 border-muted-foreground/30 bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
						/>
						<div class="flex-1">
							<span class="text-xs font-medium">Symbols</span>
							<span class="ml-1.5 text-xs text-muted-foreground">(!@#$%...)</span>
						</div>
					</label>
				</div>
			</div>

			<!-- Exclusion Options -->
			<div class="space-y-2">
				<p class="text-xs font-medium">Advanced Options</p>
				<div class="grid gap-2">
					<label
						class="group flex cursor-pointer items-center gap-2.5 rounded-lg border bg-muted/30 p-2.5 transition-colors hover:bg-muted/50 {excludeSimilar
							? 'border-primary/50 bg-primary/5'
							: ''}"
					>
						<input
							type="checkbox"
							bind:checked={excludeSimilar}
							disabled={mode !== 'generate'}
							class="h-4 w-4 cursor-pointer rounded border-2 border-muted-foreground/30 bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
						/>
						<div class="flex-1">
							<span class="text-xs font-medium">Exclude Similar</span>
							<span class="ml-1.5 text-xs text-muted-foreground">(i, l, 1, L, o, 0, O)</span>
						</div>
					</label>

					<label
						class="group flex cursor-pointer items-center gap-2.5 rounded-lg border bg-muted/30 p-2.5 transition-colors hover:bg-muted/50 {excludeAmbiguous
							? 'border-primary/50 bg-primary/5'
							: ''}"
					>
						<input
							type="checkbox"
							bind:checked={excludeAmbiguous}
							disabled={mode !== 'generate'}
							class="h-4 w-4 cursor-pointer rounded border-2 border-muted-foreground/30 bg-background text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
						/>
						<div class="flex-1">
							<span class="text-xs font-medium">Exclude Ambiguous</span>
							<span class="ml-1.5 text-xs text-muted-foreground">({'{}[]()...'})</span>
						</div>
					</label>
				</div>
			</div>
		</div>

		<!-- Password History -->
		<div class="flex min-h-0 flex-col gap-3 rounded-xl border bg-card p-4 lg:overflow-y-auto">
			<div class="flex items-center justify-between">
				<h3 class="text-base font-semibold">Password History</h3>
				{#if passwordHistory.length > 0}
					<button
						onclick={clear}
						class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent"
					>
						<Trash2 class="h-3 w-3" />
						Clear
					</button>
				{/if}
			</div>

			{#if passwordHistory.length > 0}
				<div class="flex flex-col gap-2">
					{#each passwordHistory as historyPassword, i (i)}
						<div
							class="group flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
						>
							<code class="flex-1 truncate font-mono text-xs">{historyPassword}</code>
							<button
								onclick={() => copyToClipboard(historyPassword)}
								class="ml-2 rounded-md p-1 opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
								title="Copy"
							>
								<Copy class="h-3.5 w-3.5" />
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<div
					class="flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-xs text-muted-foreground"
				>
					Generated passwords will appear here
				</div>
			{/if}
		</div>
	</div>
</div>
