<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Switch } from '$lib/components/ui/switch';
	import { Copy, Lock, Clock, AlertTriangle } from '@lucide/svelte';

	let usePassword = $state(false);
	let useExpiration = $state(false);
	let noteUrl = $state('');
	let showSuccess = $state(false);
	let isSubmitting = $state(false);

	function copyToClipboard() {
		navigator.clipboard.writeText(window.location.origin + noteUrl);
		alert('URL copied to clipboard!');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
	<div class="max-w-2xl mx-auto pt-10">
		<div class="text-center mb-8">
			<a href="/" class="group">
				<h1 class="text-4xl font-bold text-white mb-2 hover:text-slate-300 transition-colors">Secret Notes</h1>
				<p class="text-slate-400 group-hover:text-slate-300 transition-colors">Create encrypted self-destructing notes</p>
			</a>
		</div>

		{#if showSuccess && noteUrl}
			<Alert class="mb-6 border-green-500 bg-green-950/50">
				<AlertTriangle class="h-4 w-4" />
				<AlertDescription class="flex items-center justify-between">
					<span class="text-green-400"
						>Note created successfully! This URL will be destroyed after being accessed.</span
					>
					<Button onclick={copyToClipboard} size="sm" variant="outline" class="ml-4">
						<Copy class="h-4 w-4 mr-2" />
						Copy URL
					</Button>
				</AlertDescription>
			</Alert>

			<Card class="mb-6 bg-slate-800 border-slate-700">
				<CardContent class="p-4">
					<div class="flex items-center space-x-2">
						<Input
							value={window.location.origin + noteUrl}
							readonly
							class="bg-slate-900 border-slate-600 text-slate-200"
						/>
						<Button onclick={copyToClipboard} size="icon" variant="outline" class="shrink-0">
							<Copy class="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>
		{/if}

		<Card class="bg-slate-800 border-slate-700">
			<CardHeader>
				<CardTitle class="text-white">Create New Note</CardTitle>
				<CardDescription class="text-slate-400">
					The note will be encrypted and destroyed after being read once
				</CardDescription>
			</CardHeader>

			<form
				method="POST"
				action="?/create"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ result, update }) => {
						isSubmitting = false;
						if (result.type === 'success' && result.data) {
							noteUrl = result.data.url;
							showSuccess = true;
						}
						await update();
					};
				}}
			>
				<CardContent class="space-y-4">
					<div class="space-y-2">
						<Label for="content" class="text-slate-200">Note Content</Label>
						<Textarea
							id="content"
							name="content"
							placeholder="Enter your secret message here..."
							required
							class="min-h-[200px] bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
						/>
					</div>

					<div class="space-y-4">
						<div
							class="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-700"
						>
							<div class="flex items-center space-x-2">
								<Lock class="h-4 w-4 text-slate-400" />
								<Label for="usePassword" class="text-slate-200 cursor-pointer">
									Password protect
								</Label>
							</div>
							<Switch id="usePassword" bind:checked={usePassword} />
						</div>

						{#if usePassword}
							<div class="space-y-2 pl-6">
								<Label for="password" class="text-slate-200">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Enter a strong password"
									class="bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
								/>
							</div>
						{/if}

						<div
							class="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-700"
						>
							<div class="flex items-center space-x-2">
								<Clock class="h-4 w-4 text-slate-400" />
								<Label for="useExpiration" class="text-slate-200 cursor-pointer">
									Add expiration time
								</Label>
							</div>
							<Switch id="useExpiration" bind:checked={useExpiration} />
						</div>

						{#if useExpiration}
							<div class="space-y-2 pl-6">
								<Label for="expirationMinutes" class="text-slate-200"
									>Time until expiration (minutes)</Label
								>
								<Input
									id="expirationMinutes"
									name="expirationMinutes"
									type="number"
									min="1"
									max="10080"
									placeholder="Ex: 60 (1 hour)"
									class="bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
								/>
								<p class="text-xs text-slate-500">Maximum: 10080 minutes (7 days)</p>
							</div>
						{/if}
					</div>
				</CardContent>

				<CardFooter>
					<Button type="submit" class="w-full mt-4" disabled={isSubmitting}>
						{isSubmitting ? 'Creating...' : 'Create Secret Note'}
					</Button>
				</CardFooter>
			</form>
		</Card>

		<div class="mt-8 text-center text-slate-500 text-sm">
			<p>All notes are encrypted and temporarily stored in server memory.</p>
			<p>No data is permanently saved.</p>
		</div>
	</div>
</div>
