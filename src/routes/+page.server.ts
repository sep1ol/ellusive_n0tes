import type { Actions } from './$types';
import { notesStorage } from '$lib/server/storage';
import { fail } from '@sveltejs/kit';

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const content = data.get('content') as string;
		const password = data.get('password') as string | null;
		const expirationMinutes = data.get('expirationMinutes') as string | null;

		if (!content || content.trim().length === 0) {
			return fail(400, { error: 'Content is required' });
		}

		const expiration = expirationMinutes ? parseInt(expirationMinutes, 10) : undefined;

		if (expiration && (isNaN(expiration) || expiration < 1 || expiration > 10080)) {
			return fail(400, { error: 'Expiration must be between 1 and 10080 minutes (7 days)' });
		}

		try {
			console.log('[Route] Creating note with:', {
				contentLength: content.length,
				hasPassword: !!password,
				expiration
			});

			const noteId = notesStorage.addNote(
				content,
				password || undefined,
				expiration
			);

			console.log('[Route] Note created successfully with ID:', noteId);

			return {
				success: true,
				noteId,
				url: `/note/${noteId}`
			};
		} catch (error) {
			console.error('[Route] Error creating note:', error);
			return fail(500, { error: 'Failed to create note' });
		}
	}
} satisfies Actions;