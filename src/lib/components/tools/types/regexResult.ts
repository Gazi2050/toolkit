/**
 * Result of a regex test.
 */
export interface RegexResult {
	/** Whether the pattern matched the text */
	success: boolean;
	/** All matched substrings */
	matches: string[];
	/** Detailed match objects including groups and indices */
	execMatches?: RegExpExecArray[];
	/** Optional error message when the pattern is invalid */
	error?: string;
}
