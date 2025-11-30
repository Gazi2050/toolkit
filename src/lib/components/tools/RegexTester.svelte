<script lang="ts">
	import { Copy, RefreshCw, AlertCircle, Check } from '@lucide/svelte';

	let pattern = $state('');
	let testString = $state('');
	let activeFlags = $state({
		g: true,
		i: false,
		m: false,
		s: false,
		u: false
	});

	let matches = $state<RegExpExecArray[]>([]);
	let error = $state<string | null>(null);
	let copied = $state(false);

	const flags = [
		{ key: 'g', description: 'Global' },
		{ key: 'i', description: 'Case Insensitive' },
		{ key: 'm', description: 'Multiline' },
		{ key: 's', description: 'Dot All' },
		{ key: 'u', description: 'Unicode' }
	];

	const commonPatterns = [
		{ name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
		{
			name: 'URL',
			pattern:
				'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)'
		},
		{ name: 'Phone', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
		{ name: 'Date', pattern: '\\d{4}-\\d{2}-\\d{2}' },
		{ name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
		{ name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}' }
	];

	/**
	 * Toggles the state of a regex flag
	 * @param key - The flag key (e.g., 'g', 'i')
	 */
	function toggleFlag(key: string): void {
		activeFlags[key as keyof typeof activeFlags] = !activeFlags[key as keyof typeof activeFlags];
	}

	/**
	 * Constructs the flags string for RegExp constructor
	 */
	function getFlagsString(): string {
		return (
			Object.entries(activeFlags)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.filter(([_key, value]) => value)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				.map(([key, _val]) => key)
				.join('')
		);
	}

	/**
	 * Tests the regex pattern against the test string
	 */
	function testRegex(): void {
		try {
			if (!pattern || !testString) {
				matches = [];
				error = null;
				return;
			}

			const flagsStr = getFlagsString();
			const regex = new RegExp(pattern, flagsStr);

			matches = [];
			if (activeFlags.g) {
				let match;
				while ((match = regex.exec(testString)) !== null) {
					matches.push(match);
					if (match.index === regex.lastIndex) {
						regex.lastIndex++;
					}
				}
			} else {
				const match = regex.exec(testString);
				if (match) matches.push(match);
			}

			error = null;
		} catch (e) {
			error = (e as Error).message;
			matches = [];
		}
	}

	/**
	 * Loads a common pattern into the input
	 * @param patternStr - The regex pattern string
	 */
	function loadPattern(patternStr: string): void {
		pattern = patternStr;
	}

	/**
	 * Clears all inputs and results
	 */
	function clear(): void {
		pattern = '';
		testString = '';
		matches = [];
		error = null;
	}

	/**
	 * Copies the full regex pattern (including flags) to clipboard
	 */
	function copyPattern(): void {
		if (pattern) {
			const flagsStr = getFlagsString();
			navigator.clipboard.writeText(`/${pattern}/${flagsStr}`);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	$effect(() => {
		testRegex();
	});
</script>

<div class="flex max-h-[calc(100vh-10rem)] flex-col gap-4 overflow-hidden">
	<div class="flex flex-col gap-3 rounded-lg border bg-card p-3">
		<div class="flex flex-col gap-2">
			<label for="pattern" class="text-sm font-medium">Regular Expression</label>
			<div class="flex items-center gap-2">
				<span class="text-lg text-muted-foreground">/</span>
				<input
					id="pattern"
					type="text"
					bind:value={pattern}
					placeholder="Enter regex pattern..."
					class="flex-1 rounded-md border bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 {error
						? 'border-red-500/50 focus:ring-red-500/30'
						: ''}"
				/>
				<span class="text-lg text-muted-foreground">/</span>
				<span class="min-w-[3rem] font-mono text-sm text-muted-foreground">{getFlagsString()}</span>
			</div>
			{#if error}
				<p class="text-sm text-red-500">{error}</p>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<span class="text-sm font-medium" id="flags-label">Flags</span>
			<div class="flex flex-wrap gap-2" role="group" aria-labelledby="flags-label">
				{#each flags as flag (flag.key)}
					<button
						onclick={() => toggleFlag(flag.key)}
						class="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {activeFlags[
							flag.key as keyof typeof activeFlags
						]
							? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
							: 'border-input bg-background hover:bg-accent'}"
						aria-pressed={activeFlags[flag.key as keyof typeof activeFlags]}
					>
						<span class="font-mono font-bold">{flag.key}</span>
						<span class="text-xs opacity-90">{flag.description}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="flex flex-col gap-2">
			<span class="text-sm font-medium" id="patterns-label">Common Patterns</span>
			<div class="flex flex-wrap gap-2" role="group" aria-labelledby="patterns-label">
				{#each commonPatterns as cp (cp.name)}
					<button
						onclick={() => loadPattern(cp.pattern)}
						class="rounded-md bg-muted px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/80"
						title={cp.name}
					>
						{cp.name}
					</button>
				{/each}
			</div>
		</div>

		<div class="flex gap-2">
			<button
				onclick={copyPattern}
				disabled={!pattern}
				class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
			>
				{#if copied}
					<Check class="h-4 w-4" />
					Copied
				{:else}
					<Copy class="h-4 w-4" />
					Copy Pattern
				{/if}
			</button>
			<button
				onclick={clear}
				class="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
			>
				<RefreshCw class="h-4 w-4" />
				Clear
			</button>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<label for="test-string" class="text-sm font-medium">Test String</label>
		<textarea
			id="test-string"
			bind:value={testString}
			placeholder="Enter text to test against the pattern..."
			class="h-32 resize-none rounded-lg border bg-muted/30 p-3 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary/30"
		></textarea>
	</div>

	<div class="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium">Results</span>
			{#if pattern && testString}
				{#if matches.length > 0}
					<span
						class="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400"
					>
						<div class="h-2 w-2 rounded-full bg-green-500"></div>
						{matches.length}
						{matches.length === 1 ? 'match' : 'matches'}
					</span>
				{:else if error}
					<span
						class="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<AlertCircle class="h-3.5 w-3.5" />
						Error
					</span>
				{:else}
					<span
						class="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400"
					>
						<div class="h-2 w-2 rounded-full bg-red-500"></div>
						No matches
					</span>
				{/if}
			{/if}
		</div>

		<div class="min-h-0 flex-1 overflow-y-auto rounded-lg border bg-card p-3">
			{#if error}
				<div
					class="flex items-start gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
				>
					<AlertCircle class="mt-0.5 h-4 w-4 flex-shrink-0" />
					<div>
						<div class="font-medium">Invalid Regular Expression</div>
						<div class="mt-1 text-xs opacity-90">{error}</div>
					</div>
				</div>
			{:else if matches.length > 0}
				<div class="space-y-2">
					{#each matches as match, i (i)}
						<div class="rounded-md border bg-muted/50 p-2.5">
							<div class="mb-1.5 flex items-center gap-2">
								<span class="text-sm font-medium">Match {i + 1}</span>
								{#if match.index !== undefined}
									<span class="text-xs text-muted-foreground">at position {match.index}</span>
								{/if}
							</div>
							<code class="block rounded bg-background px-2.5 py-1.5 font-mono text-sm"
								>{match[0]}</code
							>
							{#if match.length > 1}
								<div class="mt-2 space-y-1">
									{#each match.slice(1) as group, j (j)}
										{#if group !== undefined}
											<div class="text-sm">
												<span class="text-muted-foreground">Group {j + 1}:</span>
												<code class="ml-2 rounded bg-background px-2 py-1 font-mono text-xs"
													>{group}</code
												>
											</div>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{:else if pattern && testString}
				<div class="flex h-24 items-center justify-center text-sm text-muted-foreground">
					No matches found
				</div>
			{:else}
				<div class="flex h-24 items-center justify-center text-sm text-muted-foreground">
					Enter a pattern and test string to see results
				</div>
			{/if}
		</div>
	</div>
</div>
