import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const algorithm = 'aes-256-gcm';
const saltLength = 32;
const tagLength = 16;
const ivLength = 16;
const keyLength = 32;

export function encrypt(text: string, masterKey: string): string {
	try {
		if (!text) {
			throw new Error('Text to encrypt cannot be empty');
		}
		if (!masterKey) {
			throw new Error('Master key is required for encryption');
		}

		const salt = randomBytes(saltLength);
		const iv = randomBytes(ivLength);

		const key = scryptSync(masterKey, salt, keyLength);

		const cipher = createCipheriv(algorithm, key, iv);

		const encrypted = Buffer.concat([
			cipher.update(text, 'utf8'),
			cipher.final()
		]);

		const tag = cipher.getAuthTag();

		return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
	} catch (error) {
		console.error('[Crypto] Encryption error:', error);
		throw error;
	}
}

export function decrypt(encryptedData: string, masterKey: string): string {
	try {
		if (!encryptedData) {
			throw new Error('Encrypted data cannot be empty');
		}
		if (!masterKey) {
			throw new Error('Master key is required for decryption');
		}

		const data = Buffer.from(encryptedData, 'base64');

		const salt = data.slice(0, saltLength);
		const iv = data.slice(saltLength, saltLength + ivLength);
		const tag = data.slice(saltLength + ivLength, saltLength + ivLength + tagLength);
		const encrypted = data.slice(saltLength + ivLength + tagLength);

		const key = scryptSync(masterKey, salt, keyLength);

		const decipher = createDecipheriv(algorithm, key, iv);
		decipher.setAuthTag(tag);

		const decrypted = Buffer.concat([
			decipher.update(encrypted),
			decipher.final()
		]);

		return decrypted.toString('utf8');
	} catch (error) {
		console.error('[Crypto] Decryption error:', error);
		throw error;
	}
}

export function hashPassword(password: string): string {
	const salt = randomBytes(16);
	const hash = scryptSync(password, salt, 64);
	return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
	const [salt, hash] = storedHash.split(':');
	const saltBuffer = Buffer.from(salt, 'hex');
	const hashBuffer = scryptSync(password, saltBuffer, 64);
	return hashBuffer.toString('hex') === hash;
}