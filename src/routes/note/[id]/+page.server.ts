import type { PageServerLoad, Actions } from './$types';
import { notesStorage } from '$lib/server/storage';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const noteId = params.id;
	console.log('[Route Note] Loading note page for ID:', noteId);

	try {
		const noteInfo = notesStorage.checkNoteExists(noteId);

		if (!noteInfo.exists) {
			console.log('[Route Note] Note not found, returning 404');
			throw error(404, {
				message: 'Note not found or already destroyed'
			});
		}

		console.log('[Route Note] Note found, hasPassword:', noteInfo.hasPassword);
		return {
			noteId,
			hasPassword: noteInfo.hasPassword,
			expiresAt: noteInfo.expiresAt?.toISOString()
		};
	} catch (err) {
		console.error('[Route Note] Error in load function:', err);
		throw err;
	}
};

export const actions = {
	unlock: async ({ request, params }) => {
		const data = await request.formData();
		const password = data.get('password') as string;

		const note = notesStorage.getNote(params.id, password);

		if (!note) {
			return fail(401, {
				error: 'Incorrect password or note not found',
				hasPassword: true
			});
		}

		notesStorage.markAsReadAndDelete(params.id);

		return {
			success: true,
			content: note.content
		};
	},

	view: async ({ params }) => {
		console.log('[Route Note] Action view called for ID:', params.id);

		const note = notesStorage.getNote(params.id);

		if (!note) {
			console.log('[Route Note] Note not found in view action - may have been viewed in another tab');
			return fail(404, {
				error: 'Note not found or already destroyed (may have been viewed in another tab/window)'
			});
		}

		if (note.password) {
			console.log('[Route Note] Note has password, cannot view without it');
			return fail(401, {
				error: 'This note is password protected',
				hasPassword: true
			});
		}

		// Captura o conteúdo ANTES de deletar
		const content = note.content;
		console.log('[Route Note] Note content captured, now deleting');

		// Agora deleta a nota
		notesStorage.markAsReadAndDelete(params.id);

		return {
			success: true,
			content: content,
			destroyed: true
		};
	}
} satisfies Actions;