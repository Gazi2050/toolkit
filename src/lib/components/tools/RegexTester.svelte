<script lang="ts">
	import { Copy, Trash2 } from '@lucide/svelte';

	let pattern = $state('');
	let testString = $state('');
	let flags = $state({
		g: true,  // global
		i: false, // case insensitive
		m: false, // multiline
		s: false, // dotAll
		u: false, // unicode
		y: false  // sticky
	});

	let matches: RegExpMatchArray | null = $state(null);
	let error = $state<string | null>(null);
	let highlightedText = $state('');

	// Common regex patterns
	const commonPatterns = [
		{ name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
		{ name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
		{ name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
		{ name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
		{ name: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
		{ name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}' },
		{ name: 'Username', pattern: '[a-zA-Z0-9_-]{3,16}' },
		{ name: 'Password (Strong)', pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}' }
	];

	function getFlagsString(): string {
		return Object.entries(flags)
			.filter(([_, value]) => value)
			.map(([key, _]) => key)
			.join('');
	}

	function testRegex() {
		try {
			if (!pattern || !testString) {
				matches = null;
				highlightedText = testString;
				error = null;
				return;
			}

			const flagsStr = getFlagsString();
			const regex = new RegExp(pattern, flagsStr);
			
			// Get all matches
			if (flags.g) {
				matches = testString.match(regex);
			} else {
				const match = regex.exec(testString);
				matches = match ? [match[0]] : null;
			}

			// Highlight matches in text
			if (matches && matches.length > 0) {
				let result = testString;
				const sortedMatches = [...matches].sort((a, b) => b.length - a.length);
				
				sortedMatches.forEach(match => {
					const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
					result = result.replace(
						new RegExp(escapedMatch, 'g'),
						`<mark class="bg-green-500/30 text-green-600 dark:text-green-400 rounded px-0.5">${match}</mark>`
					);
				});
				
				highlightedText = result;
			} else {
				highlightedText = testString;
			}

			error = null;
		} catch (e) {
			error = (e as Error).message;
			matches = null;
			highlightedText = testString;
		}
	}

	function loadPattern(patternStr: string) {
		pattern = patternStr;
		testRegex();
	}

	function clear() {
		pattern = '';
		testString = '';
		matches = null;
		error = null;
		highlightedText = '';
	}

	function copyPattern() {
		if (pattern) {
			const flagsStr = getFlagsString();
			navigator.clipboard.writeText(`/${pattern}/${flagsStr}`);
		}
	}

	// Auto-test when pattern or test string changes
	$effect(() => {
		if (pattern || testString || Object.values(flags).some(v => v)) {
			testRegex();
		}
	});
</script>

<div class="flex flex-col gap-6">
	<!-- Pattern Input -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="regex-pattern" class="text-sm font-medium text-muted-foreground">
				Regular Expression Pattern
			</label>
			<button
				onclick={copyPattern}
				class="inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium transition-colors hover:bg-accent"
				disabled={!pattern}
			>
				<Copy class="h-3 w-3" />
				Copy Pattern
			</button>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-lg text-muted-foreground">/</span>
			<input
				id="regex-pattern"
				type="text"
				bind:value={pattern}
				class="flex-1 rounded-lg border bg-muted/50 px-4 py-2 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30 {error ? 'border-red-500/50 focus:ring-red-500/30' : ''}"
				placeholder="Enter regex pattern..."
			/>
			<span class="text-lg text-muted-foreground">/</span>
			<span class="font-mono text-sm text-muted-foreground">{getFlagsString()}</span>
		</div>
		{#if error}
			<p class="text-sm text-red-500">{error}</p>
		{/if}
	</div>

	<!-- Flags -->
	<div class="flex flex-col gap-2">
		<span class="text-sm font-medium text-muted-foreground">Flags</span>
		<div class="flex flex-wrap gap-2">
			<button
				onclick={() => (flags.g = !flags.g)}
				class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {flags.g ? 'border-primary/50 bg-primary/10 text-primary' : 'bg-background hover:bg-accent'}"
			>
				<code class="rounded bg-muted px-1.5 py-0.5 {flags.g ? 'bg-primary/20' : ''}">g</code>
				Global
			</button>
			<button
				onclick={() => (flags.i = !flags.i)}
				class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {flags.i ? 'border-primary/50 bg-primary/10 text-primary' : 'bg-background hover:bg-accent'}"
			>
				<code class="rounded bg-muted px-1.5 py-0.5 {flags.i ? 'bg-primary/20' : ''}">i</code>
				Case Insensitive
			</button>
			<button
				onclick={() => (flags.m = !flags.m)}
				class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {flags.m ? 'border-primary/50 bg-primary/10 text-primary' : 'bg-background hover:bg-accent'}"
			>
				<code class="rounded bg-muted px-1.5 py-0.5 {flags.m ? 'bg-primary/20' : ''}">m</code>
				Multiline
			</button>
			<button
				onclick={() => (flags.s = !flags.s)}
				class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {flags.s ? 'border-primary/50 bg-primary/10 text-primary' : 'bg-background hover:bg-accent'}"
			>
				<code class="rounded bg-muted px-1.5 py-0.5 {flags.s ? 'bg-primary/20' : ''}">s</code>
				Dot All
			</button>
			<button
				onclick={() => (flags.u = !flags.u)}
				class="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {flags.u ? 'border-primary/50 bg-primary/10 text-primary' : 'bg-background hover:bg-accent'}"
			>
				<code class="rounded bg-muted px-1.5 py-0.5 {flags.u ? 'bg-primary/20' : ''}">u</code>
				Unicode
			</button>
		</div>
	</div>

	<!-- Test String -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<label for="test-string" class="text-sm font-medium text-muted-foreground">
				Test String
			</label>
			<button
				onclick={clear}
				class="inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium transition-colors hover:bg-accent"
			>
				<Trash2 class="h-3 w-3" />
				Clear
			</button>
		</div>
		<textarea
			id="test-string"
			bind:value={testString}
			class="min-h-[150px] rounded-lg border bg-muted/50 p-4 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30"
			placeholder="Enter test string..."
		></textarea>
	</div>

	<!-- Results -->
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium text-muted-foreground">Results</span>
				{#if pattern && testString}
					{#if matches && matches.length > 0}
						<div class="flex items-center gap-1.5 rounded-full bg-green-500/20 px-2 py-0.5">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-xs font-medium text-green-600 dark:text-green-400">
								{matches.length} match{matches.length !== 1 ? 'es' : ''}
							</span>
						</div>
					{:else if !error}
						<div class="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-0.5">
							<div class="h-2 w-2 rounded-full bg-red-500"></div>
							<span class="text-xs font-medium text-red-600 dark:text-red-400">No matches</span>
						</div>
					{/if}
				{/if}
			</div>
		</div>
		<div class="min-h-[150px] rounded-lg border bg-muted/30 p-4">
			{#if highlightedText}
				<div class="font-mono text-sm whitespace-pre-wrap break-words">
					{@html highlightedText}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">Results will appear here...</p>
			{/if}
		</div>
	</div>

	<!-- Match Details -->
	{#if matches && matches.length > 0}
		<div class="flex flex-col gap-2">
			<span class="text-sm font-medium text-muted-foreground">Matches</span>
			<div class="rounded-lg border bg-muted/20 p-4">
				<div class="flex flex-wrap gap-2">
					{#each matches as match, i}
						<code class="rounded bg-green-500/20 px-2 py-1 text-sm text-green-600 dark:text-green-400">
							{match}
						</code>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Common Patterns -->
	<div class="flex flex-col gap-2">
		<span class="text-sm font-medium text-muted-foreground">Common Patterns</span>
		<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
			{#each commonPatterns as { name, pattern: p }}
				<button
					onclick={() => loadPattern(p)}
					class="rounded-lg border bg-muted/20 p-3 text-left transition-colors hover:bg-muted/40"
				>
					<div class="text-sm font-medium">{name}</div>
					<code class="mt-1 block truncate text-xs text-muted-foreground">{p}</code>
				</button>
			{/each}
		</div>
	</div>
</div>
