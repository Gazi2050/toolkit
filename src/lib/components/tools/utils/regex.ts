/**
 * Tests a regular expression against a string.
 *
 * @param pattern - The regex pattern (without delimiters).
 * @param text - The text to test.
 * @returns An object indicating success, matched substrings, and any error.
 */
import type { RegexResult } from '../types/regexResult.ts';

export function testRegex(pattern: string, text: string, flags: string = ''): RegexResult {
	try {
		const regex = new RegExp(pattern, flags);
		const matches: string[] = [];
		const execMatches: RegExpExecArray[] = [];

		if (regex.global) {
			let match;
			while ((match = regex.exec(text)) !== null) {
				matches.push(match[0]);
				execMatches.push(match);
				if (match.index === regex.lastIndex) {
					regex.lastIndex++;
				}
			}
		} else {
			const match = regex.exec(text);
			if (match) {
				matches.push(match[0]);
				execMatches.push(match);
			}
		}

		return {
			success: matches.length > 0,
			matches,
			execMatches
		};
	} catch (e) {
		return {
			success: false,
			matches: [],
			execMatches: [],
			error: (e as Error).message
		};
	}
}
