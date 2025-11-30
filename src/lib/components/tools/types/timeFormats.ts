/**
 * Interface describing all formatted time strings for a given time zone.
 */
export interface TimeFormats {
	iso: string; // e.g. 2024-09-15T13:45:30
	isoShort: string; // e.g. 2024-09-15
	time24: string; // 13:45:30
	time12: string; // 01:45:30 PM
	offset: string; // UTC+05:30
	unix: string; // seconds since epoch
	unixMs: string; // milliseconds since epoch
	rfc2822: string; // Mon, 15 Sep 2024 13:45:30 GMT
	utc: string; // 2024-09-15T13:45:30.000Z
	fullDate: string; // Mon, Sep 15, 2024
	fullDateTime: string; // Mon, Sep 15, 2024, 01:45:30 PM
}
