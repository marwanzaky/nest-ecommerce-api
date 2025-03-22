export type UserRole = "user" | "admin";

export interface IUser {
	_id: string;
	role: UserRole;

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
