<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
		CardFooter
	} from '$lib/components/ui/card';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { AlertTriangle, Eye, Lock, Copy, Home } from '@lucide/svelte';

	let { data, form } = $props();

	let showContent = $state(false);
	let noteContent = $state('');
	let isDestroyed = $state(false);
	let isUnlocking = $state(false);
	let errorMessage = $state('');
	let noteAlreadyViewed = $state(false);

	function copyToClipboard() {
		navigator.clipboard.writeText(noteContent);
		alert('Content copied to clipboard!');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
	<div class="max-w-2xl mx-auto pt-10">
		<div class="text-center mb-8">
			<a href="/" class="group">
				<h1 class="text-4xl font-bold text-white mb-2 hover:text-slate-300 transition-colors">
					Secret Notes
				</h1>
				<p class="text-slate-400 group-hover:text-slate-300 transition-colors">
					View self-destructing note
				</p>
			</a>
		</div>

		{#if !showContent && !isDestroyed}
			<Alert class="mb-6 border-amber-500 bg-amber-950/50">
				<AlertTriangle class="h-4 w-4" />
				<AlertTitle class="text-amber-400">Warning: Self-Destructing Note</AlertTitle>
				<AlertDescription class="text-amber-300/80">
					This note will be permanently destroyed after being viewed. Make sure you are ready to
					read the content.
				</AlertDescription>
			</Alert>

			{#if data.expiresAt}
				<Alert class="mb-6 border-blue-500 bg-blue-950/50">
					<AlertDescription class="text-blue-300">
						This note expires at: {new Date(data.expiresAt).toLocaleString('en-US')}
					</AlertDescription>
				</Alert>
			{/if}

			<Card class="bg-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle class="text-white flex items-center gap-2">
						{#if data.hasPassword}
							<Lock class="h-5 w-5" />
							Password Protected Note
						{:else}
							<Eye class="h-5 w-5" />
							View Note
						{/if}
					</CardTitle>
					<CardDescription class="text-slate-400">
						{data.hasPassword
							? 'Enter the password to unlock and view this note'
							: 'Click the button below to view and destroy this note'}
					</CardDescription>
				</CardHeader>

				{#if data.hasPassword}
					<form
						method="POST"
						action="?/unlock"
						use:enhance={() => {
							isUnlocking = true;
							errorMessage = '';
							return async ({ result }) => {
								isUnlocking = false;
								if (result.type === 'success' && result.data) {
									noteContent = result.data.content;
									showContent = true;
									isDestroyed = true;
								} else if (result.type === 'failure' && result.data) {
									errorMessage = result.data.error || 'Incorrect password';
								}
								// Don't call update() to avoid page reload
							};
						}}
					>
						<CardContent class="space-y-4">
							<div class="space-y-2">
								<Label for="password" class="text-slate-200">Password</Label>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="Enter the password"
									required
									class="bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
								/>
							</div>

							{#if errorMessage}
								<Alert class="border-red-500 bg-red-950/50">
									<AlertDescription class="text-red-400">
										{errorMessage}
									</AlertDescription>
								</Alert>
							{/if}
						</CardContent>

						<CardFooter>
							<Button type="submit" class="w-full" disabled={isUnlocking}>
								<Lock class="h-4 w-4 mr-2" />
								{isUnlocking ? 'Unlocking...' : 'Unlock and View'}
							</Button>
						</CardFooter>
					</form>
				{:else}
					<form
						method="POST"
						action="?/view"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success' && result.data) {
									noteContent = result.data.content;
									showContent = true;
									isDestroyed = true;
								} else if (result.type === 'failure' && result.data) {
									// Note was already destroyed by another tab
									errorMessage = result.data.error || 'Note already viewed in another tab';
									noteAlreadyViewed = true;
								}
								// Don't call update() to avoid page reload
							};
						}}
					>
						<CardFooter>
							<Button type="submit" class="w-full" variant="destructive">
								<Eye class="h-4 w-4 mr-2" />
								View and Destroy Note
							</Button>
						</CardFooter>
					</form>
				{/if}
			</Card>

			{#if noteAlreadyViewed}
				<Alert class="mt-6 border-red-500 bg-red-950/50">
					<AlertTriangle class="h-4 w-4" />
					<AlertTitle class="text-red-400">Note Already Viewed</AlertTitle>
					<AlertDescription class="text-red-300">
						{errorMessage}
					</AlertDescription>
				</Alert>

				<div class="mt-6 text-center">
					<Button onclick={() => (window.location.href = '/')} variant="outline">
						<Home class="h-4 w-4 mr-2" />
						Create New Note
					</Button>
				</div>
			{/if}
		{:else if showContent}
			<Alert class="mb-6 border-green-500 bg-green-950/50">
				<AlertTriangle class="h-4 w-4" />
				<AlertDescription class="text-green-400">
					Note viewed successfully. This note has been permanently destroyed.
				</AlertDescription>
			</Alert>

			<Card class="bg-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle class="text-white">Note Content</CardTitle>
					<CardDescription class="text-slate-400">
						This note has been destroyed and can no longer be accessed
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div class="bg-slate-900 border border-slate-700 rounded-lg p-4">
						<pre
							class="text-slate-200 whitespace-pre-wrap break-words font-mono text-sm">{noteContent}</pre>
					</div>
				</CardContent>

				<CardFooter class="flex gap-2">
					<Button onclick={copyToClipboard} variant="outline" class="flex-1">
						<Copy class="h-4 w-4 mr-2" />
						Copy Content
					</Button>
					<Button onclick={() => (window.location.href = '/')} class="flex-1">
						<Home class="h-4 w-4 mr-2" />
						Create New Note
					</Button>
				</CardFooter>
			</Card>
		{/if}

		{#if form?.error && !form?.hasPassword}
			<Alert class="border-red-500 bg-red-950/50">
				<AlertTriangle class="h-4 w-4" />
				<AlertTitle class="text-red-400">Note not found</AlertTitle>
				<AlertDescription class="text-red-300">
					{form.error}
				</AlertDescription>
			</Alert>

			<div class="mt-6 text-center">
				<Button onclick={() => (window.location.href = '/')} variant="outline">
					<Home class="h-4 w-4 mr-2" />
					Criar Nova Nota
				</Button>
			</div>
		{/if}
	</div>
</div>
