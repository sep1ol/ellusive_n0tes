import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Log 404 errors for notes
	if (response.status === 404 && event.url.pathname.startsWith('/note/')) {
		const noteId = event.url.pathname.split('/')[2];
		console.log(`[404] Note not found: ${noteId} - IP: ${event.getClientAddress()}`);
	}

	return response;
};