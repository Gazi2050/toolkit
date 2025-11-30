/**
 * Converts a number string from one base to another.
 * Supports bases 2‑36.
 *
 * @param value - The number as a string in the source base.
 * @param fromBase - Source base (e.g., 2, 10, 16).
 * @param toBase - Target base.
 * @returns An object with the original value and the converted string, or an error.
 */
import type { NumberBaseResult } from '../types/numberBaseResult.ts';

export function convertNumber(value: string, fromBase: number, toBase: number): NumberBaseResult {
	try {
		const num = parseInt(value, fromBase);
		if (isNaN(num)) throw new Error('Invalid number for the given base');
		const converted = num.toString(toBase).toUpperCase();
		return { original: value, converted };
	} catch (e) {
		return { original: value, converted: '', error: (e as Error).message };
	}
}
