import { encrypt, decrypt, hashPassword, verifyPassword } from './crypto';
import { ENCRYPTION_KEY } from '$env/static/private';

console.log('[Storage] ENCRYPTION_KEY loaded:', ENCRYPTION_KEY ? 'Yes' : 'No');
console.log('[Storage] ENCRYPTION_KEY length:', ENCRYPTION_KEY?.length);

export interface SecretNote {
	id: string;
	content: string;
	password?: string;
	expiresAt?: Date;
	createdAt: Date;
	isRead: boolean;
	viewingSessionId?: string;
}

class NotesStorage {
	private static instance: NotesStorage;
	private notes: Map<string, SecretNote> = new Map();

	private constructor() {
		setInterval(() => {
			this.cleanupExpiredNotes();
		}, 60000);
	}

	static getInstance(): NotesStorage {
		if (!NotesStorage.instance) {
			NotesStorage.instance = new NotesStorage();
		}
		return NotesStorage.instance;
	}

	generateId(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let id = '';
		for (let i = 0; i < 48; i++) {
			id += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return id;
	}

	addNote(content: string, password?: string, expirationMinutes?: number): string {
		const id = this.generateId();
		console.log('[Storage] Creating note with ID:', id);

		try {
			const encryptedContent = encrypt(content, ENCRYPTION_KEY);
			const hashedPassword = password ? hashPassword(password) : undefined;

			const note: SecretNote = {
				id,
				content: encryptedContent,
				password: hashedPassword,
				createdAt: new Date(),
				isRead: false
			};

			if (expirationMinutes) {
				note.expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);
				console.log('[Storage] Note will expire at:', note.expiresAt);
			}

			this.notes.set(id, note);
			console.log('[Storage] Note created successfully. Total notes in memory:', this.notes.size);
			return id;
		} catch (error) {
			console.error('[Storage] Error creating note:', error);
			throw error;
		}
	}

	getNote(id: string, password?: string): SecretNote | null {
		console.log('[Storage] Getting note with ID:', id);
		const note = this.notes.get(id);

		if (!note) {
			console.log('[Storage] Note not found in memory');
			return null;
		}

		if (note.expiresAt && note.expiresAt < new Date()) {
			console.log('[Storage] Note expired, deleting');
			this.notes.delete(id);
			return null;
		}

		if (note.password && password && !verifyPassword(password, note.password)) {
			console.log('[Storage] Invalid password provided');
			return null;
		}

		if (note.password && !password) {
			console.log('[Storage] Note requires password but none provided');
			return null;
		}

		try {
			const decryptedContent = decrypt(note.content, ENCRYPTION_KEY);
			console.log('[Storage] Note decrypted successfully');

			return {
				...note,
				content: decryptedContent
			};
		} catch (error) {
			console.error('[Storage] Error decrypting note:', error);
			throw error;
		}
	}

	checkNoteExists(id: string): { exists: boolean; hasPassword: boolean; expiresAt?: Date } {
		console.log('[Storage] Checking if note exists:', id);
		console.log('[Storage] Total notes in memory:', this.notes.size);

		const note = this.notes.get(id);

		if (!note) {
			console.log('[Storage] Note not found');
			return { exists: false, hasPassword: false };
		}

		if (note.expiresAt && note.expiresAt < new Date()) {
			console.log('[Storage] Note expired, removing');
			this.notes.delete(id);
			return { exists: false, hasPassword: false };
		}

		console.log('[Storage] Note exists, hasPassword:', !!note.password);
		return {
			exists: true,
			hasPassword: !!note.password,
			expiresAt: note.expiresAt
		};
	}

	markAsReadAndDelete(id: string): boolean {
		console.log('[Storage] Marking note as read and deleting:', id);
		const note = this.notes.get(id);

		if (!note) {
			console.log('[Storage] Cannot delete - note not found');
			return false;
		}

		this.notes.delete(id);
		console.log('[Storage] Note deleted. Remaining notes:', this.notes.size);
		return true;
	}

	private cleanupExpiredNotes() {
		const now = new Date();
		for (const [id, note] of this.notes.entries()) {
			if (note.expiresAt && note.expiresAt < now) {
				this.notes.delete(id);
			}
		}
	}

	getStats() {
		return {
			totalNotes: this.notes.size,
			expiredNotes: Array.from(this.notes.values()).filter(
				n => n.expiresAt && n.expiresAt < new Date()
			).length
		};
	}
}

export const notesStorage = NotesStorage.getInstance();