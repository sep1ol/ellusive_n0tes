<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { AlertCircle, Home, RefreshCw, ChevronDown, ChevronUp, HelpCircle } from '@lucide/svelte';

	let showDetails = $state(false);
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
	<div class="max-w-2xl mx-auto pt-10">
		<div class="text-center mb-8">
			<a href="/" class="group">
				<h1 class="text-4xl font-bold text-white mb-2 hover:text-slate-300 transition-colors">
					Secret Notes
				</h1>
				<p class="text-slate-400 group-hover:text-slate-300 transition-colors">
					Self-Destructing Encrypted Messages
				</p>
			</a>
		</div>

		{#if $page.status === 404}
			<Card class="bg-slate-800 border-slate-700">
				<CardHeader class="text-center">
					<div class="flex justify-center mb-4">
						<div class="p-4 rounded-full bg-red-950/50">
							<AlertCircle class="h-16 w-16 text-red-400" />
						</div>
					</div>
					<CardTitle class="text-white text-3xl">404 - Note Not Found</CardTitle>
					<CardDescription class="text-slate-400 mt-4 text-lg">
						{#if $page.url.pathname.startsWith('/note/')}
							This note doesn't exist or has already been destroyed. Remember, notes are
							automatically deleted after being viewed once.
						{:else}
							The page you're looking for doesn't exist.
						{/if}
					</CardDescription>
				</CardHeader>

				<CardContent class="space-y-4">
					<Button
						onclick={() => (showDetails = !showDetails)}
						variant="ghost"
						class="w-full justify-between text-amber-400 hover:text-amber-300 hover:bg-amber-950/30"
					>
						<div class="flex items-center gap-2">
							<HelpCircle class="h-4 w-4" />
							<span>Why am I seeing this?</span>
						</div>
						{#if showDetails}
							<ChevronUp class="h-4 w-4" />
						{:else}
							<ChevronDown class="h-4 w-4" />
						{/if}
					</Button>

					{#if showDetails}
						<div class="overflow-hidden transition-all duration-300 ease-in-out">
							<Alert class="border-amber-500 bg-amber-950/50">
								<AlertCircle class="h-4 w-4" />
								<AlertTitle class="text-amber-400">Possible reasons:</AlertTitle>
								<AlertDescription class="text-amber-300/80">
									<ul class="list-disc list-inside mt-2 space-y-2">
										<li><strong>Already viewed:</strong> Someone accessed this note before you</li>
										<li>
											<strong>Incorrect URL:</strong> The link might have been copied incorrectly
										</li>
										<li><strong>Expired:</strong> The note had a time limit that has passed</li>
										<li><strong>Never existed:</strong> This note ID was never created</li>
									</ul>
								</AlertDescription>
							</Alert>
						</div>
					{/if}

					<div class="flex flex-col sm:flex-row gap-3 pt-4">
						<Button onclick={() => (window.location.href = '/')} class="flex-1">
							<Home class="h-4 w-4 mr-2" />
							Create New Note
						</Button>
					</div>
				</CardContent>
			</Card>
		{:else}
			<Card class="bg-slate-800 border-slate-700">
				<CardHeader class="text-center">
					<div class="flex justify-center mb-4">
						<div class="p-4 rounded-full bg-red-950/50">
							<AlertCircle class="h-16 w-16 text-red-400" />
						</div>
					</div>
					<CardTitle class="text-white text-3xl">Error {$page.status}</CardTitle>
					<CardDescription class="text-slate-400 mt-4 text-lg">
						{$page.error?.message || 'An unexpected error occurred'}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div class="flex flex-col sm:flex-row gap-3 pt-4">
						<Button onclick={() => (window.location.href = '/')} class="flex-1">
							<Home class="h-4 w-4 mr-2" />
							Go Home
						</Button>
						<Button onclick={() => window.location.reload()} variant="outline" class="flex-1">
							<RefreshCw class="h-4 w-4 mr-2" />
							Try Again
						</Button>
					</div>
				</CardContent>
			</Card>
		{/if}

		<div class="mt-8 text-center text-slate-500 text-sm">
			<p>All notes are encrypted and self-destruct after being read.</p>
			<p>No data is permanently stored.</p>
		</div>
	</div>
</div>
