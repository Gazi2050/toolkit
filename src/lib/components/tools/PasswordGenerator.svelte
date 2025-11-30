<script lang="ts">
	import { Copy, RefreshCw, Shield, Check, Eye, EyeOff } from '@lucide/svelte';
	import { generatePassword as generatePasswordUtil } from './utils/password';
	import { copyToClipboard } from './utils/copy';

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

	function calculateStrength(pwd: string): {
		score: number;
		label: string;
		color: string;
		percentage: number;
	} {
		if (!pwd) return { score: 0, label: 'None', color: 'bg-muted', percentage: 0 };

		let score = 0;
		let charsetSize = 0;

		// Length scoring (more granular)
		if (pwd.length >= 8) score += 1;
		if (pwd.length >= 12) score += 1;
		if (pwd.length >= 16) score += 1;
		if (pwd.length >= 20) score += 1;

		// Character variety scoring
		if (/[a-z]/.test(pwd)) {
			score += 1;
			charsetSize += 26;
		}
		if (/[A-Z]/.test(pwd)) {
			score += 1;
			charsetSize += 26;
		}
		if (/[0-9]/.test(pwd)) {
			score += 1;
			charsetSize += 10;
		}
		if (/[^a-zA-Z0-9]/.test(pwd)) {
			score += 1;
			charsetSize += 32;
		}

		// Entropy bonus (password randomness)
		if (charsetSize > 0) {
			const entropy = pwd.length * Math.log2(charsetSize);
			if (entropy >= 60) score += 1;
			if (entropy >= 80) score += 1;
		}

		// Check for common patterns (penalty)
		if (/^[0-9]+$/.test(pwd) || /^[a-zA-Z]+$/.test(pwd)) score -= 1;
		if (/(.)\\1{2,}/.test(pwd)) score -= 0.5; // Repeated characters
		if (/^(123|abc|qwerty|password)/i.test(pwd)) score -= 2; // Common patterns

		const maxScore = 10;
		score = Math.max(0, Math.min(maxScore, score));
		const percentage = Math.round((score / maxScore) * 100);

		if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500', percentage };
		if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-orange-500', percentage };
		if (score <= 6) return { score: 3, label: 'Good', color: 'bg-yellow-500', percentage };
		if (score <= 8) return { score: 4, label: 'Strong', color: 'bg-green-500', percentage };
		return { score: 5, label: 'Very Strong', color: 'bg-green-600', percentage };
	}

	function generatePassword(): void {
		password = generatePasswordUtil({
			length,
			uppercase: includeUppercase,
			lowercase: includeLowercase,
			numbers: includeNumbers,
			symbols: includeSymbols,
			excludeSimilar,
			excludeAmbiguous
		});

		if (password && !passwordHistory.includes(password)) {
			passwordHistory = [password, ...passwordHistory].slice(0, 5);
		}
	}

	async function copy(text: string) {
		if (!text) return;
		await copyToClipboard(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

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
		if (!pwd) return ['Enter a password to test'];

		if (pwd.length < 8) suggestions.push('Use at least 8 characters');
		else if (pwd.length < 12) suggestions.push('Consider 12+ characters');

		if (!/[a-z]/.test(pwd)) suggestions.push('Add lowercase letters');
		if (!/[A-Z]/.test(pwd)) suggestions.push('Add uppercase letters');
		if (!/[0-9]/.test(pwd)) suggestions.push('Add numbers');
		if (!/[^a-zA-Z0-9]/.test(pwd)) suggestions.push('Add special characters');

		// Check for common patterns
		if (/^[0-9]+$/.test(pwd)) suggestions.push('Avoid only numbers');
		if (/^[a-zA-Z]+$/.test(pwd)) suggestions.push('Mix letters with numbers/symbols');
		if (/(.) {2,}/.test(pwd)) suggestions.push('Avoid repeated characters');
		if (/^(123|abc|qwerty|password)/i.test(pwd)) suggestions.push('Avoid common patterns');

		return suggestions;
	}

	let activePassword = $derived(mode === 'generate' ? password : testPassword);
	let strength = $derived(calculateStrength(activePassword));
	// @ts-expect-error - mode type narrowing issue
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

<div class="flex flex-col gap-6">
	<!-- Top Controls -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="flex rounded-md border bg-muted/50 p-1">
				<button
					class="rounded px-3 py-1.5 text-sm font-medium transition-colors {mode === 'generate'
						? 'bg-background shadow-sm'
						: 'text-muted-foreground hover:text-foreground'}"
					onclick={() => (mode = 'generate')}
				>
					Generate
				</button>
				<button
					class="rounded px-3 py-1.5 text-sm font-medium transition-colors {mode === 'test'
						? 'bg-background shadow-sm'
						: 'text-muted-foreground hover:text-foreground'}"
					onclick={() => (mode = 'test')}
				>
					Test
				</button>
			</div>
		</div>
		<div class="flex gap-2">
			<button
				onclick={clear}
				class="rounded-md border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary/30"
			>
				Clear
			</button>
		</div>
	</div>

	<!-- Main Input/Output Area -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="password-output" class="text-sm font-medium text-muted-foreground">
				{mode === 'generate' ? 'Generated Password' : 'Test Password'}
			</label>
			<div class="flex items-center gap-2">
				<div class="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-0.5">
					<Shield class="h-3.5 w-3.5 {strength.color.replace('bg-', 'text-')}" />
					<span class="text-xs font-medium">{strength.label}</span>
				</div>
			</div>
		</div>
		<div class="relative">
			{#if mode === 'generate'}
				<input
					id="password-output"
					type="text"
					readonly
					value={password}
					class="w-full rounded-lg border bg-muted/50 px-4 py-3 pr-24 font-mono text-lg transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30"
					placeholder="Click generate..."
				/>
				<div class="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
					<button
						onclick={() => copy(password)}
						disabled={!password}
						class="rounded-md p-1.5 hover:bg-background disabled:opacity-50"
						title="Copy"
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
						title="Regenerate"
					>
						<RefreshCw class="h-4 w-4" />
					</button>
				</div>
			{:else}
				<input
					id="password-test"
					type={showTestPassword ? 'text' : 'password'}
					bind:value={testPassword}
					class="w-full rounded-lg border bg-muted/50 px-4 py-3 pr-24 font-mono text-lg transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30"
					placeholder="Type to test..."
				/>
				<div class="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
					<button
						onclick={() => (showTestPassword = !showTestPassword)}
						class="rounded-md p-1.5 hover:bg-background"
						title={showTestPassword ? 'Hide' : 'Show'}
					>
						{#if showTestPassword}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</button>
				</div>
			{/if}
		</div>

		<!-- Strength Bar -->
		<div class="flex items-center gap-3">
			<div class="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
				<div
					class="h-full transition-all duration-300 {strength.color}"
					style="width: {strength.percentage}%"
				></div>
			</div>
			<span class="min-w-[3rem] text-right text-sm font-semibold tabular-nums">
				{strength.percentage}%
			</span>
		</div>

		{#if suggestions.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each suggestions as suggestion (suggestion)}
					<span class="text-xs text-red-500">• {suggestion}</span>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Configuration Grid -->
	<div
		class="grid gap-6 lg:grid-cols-2 {mode !== 'generate' ? 'opacity-50 pointer-events-none' : ''}"
	>
		<!-- Length -->
		<div class="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4">
			<div class="flex items-center justify-between">
				<label for="length-slider" class="text-sm font-medium">Length</label>
				<span class="font-mono text-sm">{length}</span>
			</div>
			<input
				id="length-slider"
				type="range"
				min="4"
				max="64"
				bind:value={length}
				class="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
			/>
		</div>

		<!-- Options -->
		<div class="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4">
			<span class="text-sm font-medium">Characters</span>
			<div class="grid grid-cols-2 gap-3">
				<label
					class="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-background/50 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-background has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
				>
					<div class="relative flex items-center">
						<input
							type="checkbox"
							bind:checked={includeUppercase}
							class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 bg-background transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
						/>
						<svg
							class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<span class="text-sm font-medium">Uppercase (A-Z)</span>
				</label>
				<label
					class="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-background/50 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-background has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
				>
					<div class="relative flex items-center">
						<input
							type="checkbox"
							bind:checked={includeLowercase}
							class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 bg-background transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
						/>
						<svg
							class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<span class="text-sm font-medium">Lowercase (a-z)</span>
				</label>
				<label
					class="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-background/50 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-background has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
				>
					<div class="relative flex items-center">
						<input
							type="checkbox"
							bind:checked={includeNumbers}
							class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 bg-background transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
						/>
						<svg
							class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<span class="text-sm font-medium">Numbers (0-9)</span>
				</label>
				<label
					class="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-background/50 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-background has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
				>
					<div class="relative flex items-center">
						<input
							type="checkbox"
							bind:checked={includeSymbols}
							class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 bg-background transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
						/>
						<svg
							class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<span class="text-sm font-medium">Symbols (!@#)</span>
				</label>
			</div>
		</div>

		<!-- Advanced -->
		<div class="col-span-full flex flex-col gap-4 rounded-lg border bg-muted/30 p-4">
			<span class="text-sm font-medium">Advanced</span>
			<div class="flex flex-wrap gap-3">
				<label
					class="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-background/50 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-background has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
				>
					<div class="relative flex items-center">
						<input
							type="checkbox"
							bind:checked={excludeSimilar}
							class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 bg-background transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
						/>
						<svg
							class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<span class="text-sm font-medium">Exclude Similar (i, l, 1, L, o, 0, O)</span>
				</label>
				<label
					class="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-background/50 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-background has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
				>
					<div class="relative flex items-center">
						<input
							type="checkbox"
							bind:checked={excludeAmbiguous}
							class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-muted-foreground/30 bg-background transition-all checked:border-primary checked:bg-primary hover:border-primary/50"
						/>
						<svg
							class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="4"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<span class="text-sm font-medium">Exclude Ambiguous ({'{}[]()'})</span>
				</label>
			</div>
		</div>
	</div>
</div>
