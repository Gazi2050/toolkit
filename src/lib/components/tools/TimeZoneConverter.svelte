<script lang="ts">
	import { Copy, Check, Clock, Plus, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { formatTime, parseInTimeZone } from './utils/formatTime';
	import { copyToClipboard } from './utils/copy';

	let sourceTime = $state(new Date().toISOString().slice(0, 16));
	let sourceZone = $state(Intl.DateTimeFormat().resolvedOptions().timeZone);
	let targetZones = $state<string[]>(['UTC', 'America/New_York', 'Europe/London']);
	let copiedId = $state<string | null>(null);
	let availableZones = $state<string[]>([]);
	let newZone = $state('');
	let searchQuery = $state('');
	let showDropdown = $state(false);
	let sourceSearchQuery = $state('');
	let showSourceDropdown = $state(false);

	onMount(() => {
		availableZones = Intl.supportedValuesOf('timeZone');
	});

	function setNow(): void {
		const now = new Date();
		const timeInZone = formatTime(now, sourceZone);
		sourceTime = timeInZone.iso.slice(0, 16);
	}

	function addZone(): void {
		if (newZone && !targetZones.includes(newZone)) {
			targetZones = [...targetZones, newZone];
			newZone = '';
		}
	}

	function removeZone(zone: string): void {
		targetZones = targetZones.filter((z) => z !== zone);
	}

	async function copy(text: string, id: string) {
		await copyToClipboard(text);
		copiedId = id;
		setTimeout(() => (copiedId = null), 2000);
	}

	function selectZone(zone: string): void {
		newZone = zone;
		showDropdown = false;
		searchQuery = '';
	}

	function selectSourceZone(zone: string): void {
		sourceZone = zone;
		showSourceDropdown = false;
		sourceSearchQuery = '';
	}

	let sourceDate = $derived(parseInTimeZone(sourceTime, sourceZone));
	let filteredZones = $derived(
		availableZones
			.filter(
				(z) => !targetZones.includes(z) && z.toLowerCase().includes(searchQuery.toLowerCase())
			)
			.slice(0, 100)
	);
	let filteredSourceZones = $derived(
		availableZones
			.filter((z) => z.toLowerCase().includes(sourceSearchQuery.toLowerCase()))
			.slice(0, 100)
	);
</script>

<div class="flex flex-col gap-6">
	<!-- Source Time Section -->
	<div class="rounded-lg border bg-muted/30 p-4">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-sm font-semibold">Source Time</h3>
			<button
				onclick={setNow}
				class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-muted"
			>
				<Clock class="h-3.5 w-3.5" />
				Now
			</button>
		</div>

		<div class="grid gap-3 sm:grid-cols-2">
			<div class="flex flex-col gap-1.5">
				<label for="source-time" class="text-xs font-medium text-muted-foreground"
					>Date & Time</label
				>
				<input
					id="source-time"
					type="datetime-local"
					bind:value={sourceTime}
					class="rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="source-zone" class="text-xs font-medium text-muted-foreground">Time Zone</label>
				<div class="relative">
					<input
						id="source-zone"
						type="text"
						bind:value={sourceSearchQuery}
						onfocus={() => (showSourceDropdown = true)}
						onblur={() => setTimeout(() => (showSourceDropdown = false), 200)}
						placeholder={sourceZone || 'Search time zone...'}
						class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
					/>
					{#if showSourceDropdown && sourceSearchQuery}
						<div
							class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-background shadow-lg"
						>
							{#each filteredSourceZones as zone (zone)}
								<button
									onclick={() => selectSourceZone(zone)}
									class="w-full px-3 py-2 text-left text-sm hover:bg-muted"
								>
									{zone}
								</button>
							{:else}
								<div class="px-3 py-2 text-sm text-muted-foreground">No zones found</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Add Zone Section -->
	<div class="flex flex-col gap-3">
		<h3 class="text-sm font-semibold">Target Time Zones</h3>
		<div class="flex gap-2">
			<div class="relative flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					onfocus={() => (showDropdown = true)}
					onblur={() => setTimeout(() => (showDropdown = false), 200)}
					placeholder={newZone || 'Search time zone...'}
					class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
				/>
				{#if showDropdown && (searchQuery || !newZone)}
					<div
						class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-background shadow-lg"
					>
						{#if searchQuery}
							{#each filteredZones as zone (zone)}
								<button
									onclick={() => selectZone(zone)}
									class="w-full px-3 py-2 text-left text-sm hover:bg-muted"
								>
									{zone}
								</button>
							{:else}
								<div class="px-3 py-2 text-sm text-muted-foreground">No zones found</div>
							{/each}
						{:else}
							{#each availableZones
								.filter((z) => !targetZones.includes(z))
								.slice(0, 100) as zone (zone)}
								<button
									onclick={() => selectZone(zone)}
									class="w-full px-3 py-2 text-left text-sm hover:bg-muted"
								>
									{zone}
								</button>
							{/each}
						{/if}
					</div>
				{/if}
			</div>
			<button
				onclick={addZone}
				disabled={!newZone}
				class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
			>
				<Plus class="h-4 w-4" />
				Add
			</button>
		</div>
	</div>

	<!-- Target Zones Grid -->
	{#if targetZones.length > 0}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each targetZones as zone (zone)}
				{@const time = formatTime(sourceDate, zone)}
				<div
					class="group relative flex flex-col gap-2 rounded-lg border bg-card p-3 transition-all hover:border-primary/30 hover:shadow-sm"
				>
					<button
						onclick={() => removeZone(zone)}
						class="absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
						title="Remove"
					>
						<X class="h-3.5 w-3.5" />
					</button>

					<div class="pr-6">
						<div class="text-sm font-semibold">{zone.split('/').pop()?.replace(/_/g, ' ')}</div>
						<div class="text-xs text-muted-foreground">{time.offset}</div>
					</div>

					<div class="space-y-1">
						<!-- Full Date & Time -->
						<div class="flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5">
							<span class="text-xs font-medium">{time.fullDateTime}</span>
							<button
								onclick={() => copy(time.fullDateTime, `${zone}-datetime`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy full date/time"
							>
								{#if copiedId === `${zone}-datetime`}
									<Check class="h-3 w-3 text-green-500" />
								{:else}
									<Copy class="h-3 w-3" />
								{/if}
							</button>
						</div>

						<!-- 24-hour time -->
						<div class="flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5">
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">24h:</span>
								<span class="font-mono text-sm font-medium">{time.time24}</span>
							</div>
							<button
								onclick={() => copy(time.time24, `${zone}-time24`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy 24h time"
							>
								{#if copiedId === `${zone}-time24`}
									<Check class="h-3.5 w-3.5 text-green-500" />
								{:else}
									<Copy class="h-3.5 w-3.5" />
								{/if}
							</button>
						</div>

						<!-- 12-hour time -->
						<div class="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1">
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">12h:</span>
								<span class="font-mono text-xs">{time.time12}</span>
							</div>
							<button
								onclick={() => copy(time.time12, `${zone}-time12`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy 12h time"
							>
								{#if copiedId === `${zone}-time12`}
									<Check class="h-3 w-3 text-green-500" />
								{:else}
									<Copy class="h-3 w-3" />
								{/if}
							</button>
						</div>

						<!-- ISO Full -->
						<div class="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1">
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">ISO:</span>
								<span class="font-mono text-xs">{time.iso}</span>
							</div>
							<button
								onclick={() => copy(time.iso, `${zone}-iso`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy ISO"
							>
								{#if copiedId === `${zone}-iso`}
									<Check class="h-3 w-3 text-green-500" />
								{:else}
									<Copy class="h-3 w-3" />
								{/if}
							</button>
						</div>

						<!-- ISO Date Only -->
						<div class="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1">
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">Date:</span>
								<span class="font-mono text-xs">{time.isoShort}</span>
							</div>
							<button
								onclick={() => copy(time.isoShort, `${zone}-date`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy date"
							>
								{#if copiedId === `${zone}-date`}
									<Check class="h-3 w-3 text-green-500" />
								{:else}
									<Copy class="h-3 w-3" />
								{/if}
							</button>
						</div>

						<!-- UTC -->
						<div class="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1">
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">UTC:</span>
								<span class="font-mono text-xs">{time.utc}</span>
							</div>
							<button
								onclick={() => copy(time.utc, `${zone}-utc`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy UTC"
							>
								{#if copiedId === `${zone}-utc`}
									<Check class="h-3 w-3 text-green-500" />
								{:else}
									<Copy class="h-3 w-3" />
								{/if}
							</button>
						</div>

						<!-- RFC 2822 -->
						<div class="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1">
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">RFC:</span>
								<span class="font-mono text-xs">{time.rfc2822}</span>
							</div>
							<button
								onclick={() => copy(time.rfc2822, `${zone}-rfc`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy RFC 2822"
							>
								{#if copiedId === `${zone}-rfc`}
									<Check class="h-3 w-3 text-green-500" />
								{:else}
									<Copy class="h-3 w-3" />
								{/if}
							</button>
						</div>

						<!-- Unix (seconds) -->
						<div class="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1">
							<div class="flex items-center gap-2">
								<span class="text-xs text-muted-foreground">Unix:</span>
								<span class="font-mono text-xs">{time.unix}</span>
							</div>
							<button
								onclick={() => copy(time.unix, `${zone}-unix`)}
								class="rounded p-0.5 hover:bg-background"
								title="Copy Unix (seconds)"
							>
								{#if copiedId === `${zone}-unix`}
									<Check class="h-3 w-3 text-green-500" />
								{:else}
									<Copy class="h-3 w-3" />
								{/if}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div
			class="flex h-32 items-center justify-center rounded-lg border border-dashed bg-muted/20 text-sm text-muted-foreground"
		>
			Add time zones to see conversions
		</div>
	{/if}

	<!-- Quick Reference Section -->
	<div class="rounded-lg border bg-muted/20 p-4">
		<h3 class="mb-3 text-sm font-semibold">Quick Reference</h3>
		<div class="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
			<div>
				<span class="font-medium text-muted-foreground">Full Date & Time</span>
				<div class="mt-0.5 font-mono text-foreground">Mon, Jan 1, 2024, 12:00:00 PM</div>
				<div class="mt-1 text-[10px] text-muted-foreground">Human-readable format</div>
			</div>
			<div>
				<span class="font-medium text-muted-foreground">24h</span>
				<div class="mt-0.5 font-mono text-foreground">14:30:45</div>
				<div class="mt-1 text-[10px] text-muted-foreground">24-hour time format</div>
			</div>
			<div>
				<span class="font-medium text-muted-foreground">12h</span>
				<div class="mt-0.5 font-mono text-foreground">02:30:45 PM</div>
				<div class="mt-1 text-[10px] text-muted-foreground">12-hour time with AM/PM</div>
			</div>
			<div>
				<span class="font-medium text-muted-foreground">ISO</span>
				<div class="mt-0.5 font-mono text-foreground">2024-01-01T14:30:45</div>
				<div class="mt-1 text-[10px] text-muted-foreground">ISO 8601 date-time</div>
			</div>
			<div>
				<span class="font-medium text-muted-foreground">Date</span>
				<div class="mt-0.5 font-mono text-foreground">2024-01-01</div>
				<div class="mt-1 text-[10px] text-muted-foreground">ISO date only</div>
			</div>
			<div>
				<span class="font-medium text-muted-foreground">UTC</span>
				<div class="mt-0.5 font-mono text-foreground">2024-01-01T14:30:45.000Z</div>
				<div class="mt-1 text-[10px] text-muted-foreground">UTC timezone format</div>
			</div>
			<div>
				<span class="font-medium text-muted-foreground">RFC 2822</span>
				<div class="mt-0.5 font-mono text-foreground">Mon, 01 Jan 2024 14:30:45 GMT</div>
				<div class="mt-1 text-[10px] text-muted-foreground">Email/HTTP date format</div>
			</div>
			<div>
				<span class="font-medium text-muted-foreground">Unix</span>
				<div class="mt-0.5 font-mono text-foreground">1704117045</div>
				<div class="mt-1 text-[10px] text-muted-foreground">Seconds since epoch</div>
			</div>
		</div>
	</div>
</div>
