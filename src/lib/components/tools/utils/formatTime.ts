/**
 * Formats a `Date` for a specific IANA time zone.
 *
 * @param date - The date to format.
 * @param timeZone - IANA identifier, e.g. "Asia/Kolkata".
 * @returns An object containing all display formats.
 */
export interface TimeFormats {
	iso: string;
	isoShort: string;
	time24: string;
	time12: string;
	offset: string;
	unix: string;
	unixMs: string;
	rfc2822: string;
	utc: string;
	fullDate: string;
	fullDateTime: string;
}

export function formatTime(date: Date, timeZone: string): TimeFormats {
	try {
		// ISO full (date + time)
		const iso = date.toLocaleString('sv-SE', { timeZone }).replace(' ', 'T');
		// ISO short (date only)
		const isoShort = date.toLocaleDateString('sv-SE', { timeZone });
		// 24‑hour time
		const time24 = date.toLocaleString('en-GB', {
			timeZone,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
		// 12‑hour time with AM/PM
		const time12 = date.toLocaleString('en-US', {
			timeZone,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true
		});
		// Full date (weekday, month, day, year)
		const fullDate = date.toLocaleString('en-US', {
			timeZone,
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
		// Full date & time (includes time)
		const fullDateTime = date.toLocaleString('en-US', {
			timeZone,
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true
		});
		// Unix timestamp (seconds)
		const unix = Math.floor(date.getTime() / 1000).toString();
		// Unix timestamp (milliseconds)
		const unixMs = date.getTime().toString();
		// RFC 2822 (e.g. "Mon, 01 Jan 2024 14:30:45 GMT")
		const rfc2822 = date.toUTCString();
		// UTC string (ISO with Z)
		const utc = date.toISOString();
		// UTC offset (e.g. "UTC+05:30")
		const offset = getUtcOffset(timeZone, date);

		return {
			iso,
			isoShort,
			time24,
			time12,
			offset,
			unix,
			unixMs,
			rfc2822,
			utc,
			fullDate,
			fullDateTime
		};
	} catch {
		// Fallback for unexpected errors
		return {
			iso: 'Invalid',
			isoShort: '',
			time24: '',
			time12: '',
			offset: '',
			unix: '',
			unixMs: '',
			rfc2822: '',
			utc: '',
			fullDate: 'Invalid Time Zone',
			fullDateTime: ''
		};
	}
}

// Helper to compute the UTC offset string.
function getUtcOffset(timeZone: string, date: Date): string {
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

/**
 * Parses a date string (YYYY-MM-DDTHH:mm) as if it were in the specified time zone.
 * Returns the absolute Date object.
 */
export function parseInTimeZone(dateString: string, timeZone: string): Date {
	// Ensure we have a valid date string format (YYYY-MM-DDTHH:mm or similar)
	// We assume the input is "YYYY-MM-DDTHH:mm" from the datetime-local input.
	// We want to find the UTC timestamp that, when displayed in `timeZone`, matches `dateString`.

	// 1. Construct the target "face value" time as a UTC timestamp.
	// This gives us a stable reference point regardless of local browser time.
	let current = new Date(dateString + 'Z');

	// If invalid, return as is (or handle error)
	if (isNaN(current.getTime())) return new Date(dateString);

	// 2. We want to find a timestamp X such that X.toLocaleString(..., {timeZone}) matches dateString.
	// We use an iterative approach to find the offset.

	// Target time value (milliseconds) from the "face value" (treated as UTC)
	const targetTime = current.getTime();

	for (let i = 0; i < 3; i++) {
		// Format the current guess in the target timezone
		// We need to be careful to get the same format "YYYY-MM-DDTHH:mm" or similar ISO-like structure
		// sv-SE is good for ISO-like formatting: "2023-01-01 12:00:00"
		const formattedString = current.toLocaleString('sv-SE', { timeZone }).replace(' ', 'T');

		// Parse this formatted string back as UTC to compare with our target
		// We need to handle potential truncation of seconds in the input dateString if it doesn't have them
		// But usually dateString from input has HH:mm. toLocaleString has HH:mm:ss.
		// Let's just compare the timestamps derived from them.
		const formattedTimeInUTC = new Date(formattedString + 'Z').getTime();

		const diff = targetTime - formattedTimeInUTC;

		if (Math.abs(diff) < 1000) break; // Converged (within 1 second)

		current = new Date(current.getTime() + diff);
	}

	return current;
}
