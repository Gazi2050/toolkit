<script lang="ts">
	import TextCaseConverter from '$lib/components/tools/TextCaseConverter.svelte';
	import { Type } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Text Case Converter - ToolKit</title>
	<meta
		name="description"
		content="Convert text between various cases: snake_case, camelCase, kebab-case, Title Case, UPPERCASE, and lowercase."
	/>
</svelte:head>

<div class="flex flex-col gap-6">
	<div class="mb-6 flex items-center gap-3 border-b pb-4">
		<div class="rounded-lg bg-primary/10 p-2 text-primary">
			<Type class="h-6 w-6" />
		</div>
		<div>
			<h1 class="text-2xl font-bold tracking-tight">Text Case Converter</h1>
			<p class="text-sm text-muted-foreground">
				Convert text into various cases including snake_case, camelCase, kebab-case, Title Case, and
				more.
			</p>
		</div>
	</div>

	<TextCaseConverter />
</div>
