/**
 * Returns a UTC offset string for a given IANA time zone and date.
 * Example output: "UTC+05:30" or "UTC" for zero offset.
 *
 * @param timeZone - IANA identifier, e.g. "Asia/Kolkata".
 * @param date - Date instance to evaluate (handles DST).
 */
export function getUtcOffset(timeZone: string, date: Date): string {
	const formatter = new Intl.DateTimeFormat('en-US', {
		timeZone,
		timeZoneName: 'longOffset'
	});
	const parts = formatter.formatToParts(date);
	const offsetPart = parts.find((p) => p.type === 'timeZoneName');
	if (!offsetPart?.value) return 'UTC';
	const match = offsetPart.value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
	if (!match) return 'UTC';
	const sign = match[1];
	const hours = match[2].padStart(2, '0');
	const mins = match[3] || '00';
	return hours === '00' && mins === '00' ? 'UTC' : `UTC${sign}${hours}:${mins}`;
}
