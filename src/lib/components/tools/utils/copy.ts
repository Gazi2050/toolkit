/**
 * Copies the given text to the system clipboard.
 *
 * @param text - The string to be copied.
 */
export async function copyToClipboard(text: string): Promise<void> {
	await navigator.clipboard.writeText(text);
}
