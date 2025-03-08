export interface IUser {
	_id: string;
	role: "user" | "admin";

	/**
	 * User's full name
	 */
	name: string;
	email: string;

	/**
	 * base64
	 */
	photo?: string | null;
}
