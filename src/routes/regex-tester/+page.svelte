<script lang="ts">
	import RegexTester from '$lib/components/tools/RegexTester.svelte';
	import { Code2 } from '@lucide/svelte';
</script>

<div class="flex flex-col">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<Code2 class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Regex Generator & Tester</h1>
			<p class="text-sm text-muted-foreground">
				Create, test, and validate regular expressions with real-time feedback.
			</p>
		</div>
	</div>

	<RegexTester />
</div>
