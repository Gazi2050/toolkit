/**
 * Generates a random password based on the provided options.
 *
 * @param opts - Configuration for the password.
 * @returns A randomly generated password string.
 */
import type { PasswordOptions } from '../types/passwordOptions.ts';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

export function generatePassword(opts: PasswordOptions): string {
	const length = opts.length;
	const charsets: string[] = [];

	if (opts.uppercase) charsets.push(UPPERCASE);
	if (opts.lowercase) charsets.push(LOWERCASE);
	if (opts.numbers) charsets.push(NUMBERS);
	if (opts.symbols) charsets.push(SYMBOLS);

	if (charsets.length === 0) {
		charsets.push(LOWERCASE);
	}

	let fullCharset = charsets.join('');

	if (opts.excludeSimilar) {
		fullCharset = fullCharset
			.split('')
			.filter((c) => !SIMILAR_CHARS.includes(c))
			.join('');
	}
	if (opts.excludeAmbiguous) {
		fullCharset = fullCharset
			.split('')
			.filter((c) => !AMBIGUOUS_CHARS.includes(c))
			.join('');
	}

	if (fullCharset.length === 0) {
		fullCharset = LOWERCASE; // Fallback
	}

	const passwordArray: string[] = [];
	const randomValues = new Uint32Array(length);
	crypto.getRandomValues(randomValues);

	let index = 0;
	// Ensure at least one char from each selected charset
	for (const charset of charsets) {
		let filteredCharset = charset;
		if (opts.excludeSimilar) {
			filteredCharset = filteredCharset
				.split('')
				.filter((c) => !SIMILAR_CHARS.includes(c))
				.join('');
		}
		if (opts.excludeAmbiguous) {
			filteredCharset = filteredCharset
				.split('')
				.filter((c) => !AMBIGUOUS_CHARS.includes(c))
				.join('');
		}

		if (filteredCharset.length > 0 && index < length) {
			passwordArray.push(filteredCharset[randomValues[index] % filteredCharset.length]);
			index++;
		}
	}

	for (let i = index; i < length; i++) {
		passwordArray.push(fullCharset[randomValues[i] % fullCharset.length]);
	}

	// Shuffle
	for (let i = passwordArray.length - 1; i > 0; i--) {
		const j = randomValues[i] % (i + 1);
		[passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
	}

	return passwordArray.join('');
}
