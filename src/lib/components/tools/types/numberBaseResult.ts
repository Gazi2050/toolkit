/**
 * Result of a number base conversion.
 */
export interface NumberBaseResult {
	/** Original input string */
	original: string;
	/** Converted value as a string */
	converted: string;
	/** Optional error message if conversion failed */
	error?: string;
}
