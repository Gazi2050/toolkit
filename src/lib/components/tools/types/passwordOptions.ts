/**
 * Options for generating a random password.
 */
export interface PasswordOptions {
	/** Desired length of the password */
	length: number;
	/** Include uppercase letters */
	uppercase?: boolean;
	/** Include lowercase letters */
	lowercase?: boolean;
	/** Include numeric digits */
	numbers?: boolean;
	/** Include symbols */
	symbols?: boolean;
	/** Exclude similar characters (e.g. i, l, 1, L, o, 0, O) */
	excludeSimilar?: boolean;
	/** Exclude ambiguous characters (e.g. { } [ ] ( ) / \ ' " ` ~ , ; : . < >) */
	excludeAmbiguous?: boolean;
}
