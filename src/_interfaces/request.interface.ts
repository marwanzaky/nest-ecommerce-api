import { Request } from "express";
import { UserRole } from "./user.interface";

export interface IRequest extends Request {
	user: {
		id: string;
		role: UserRole;
		iat: number;
		exp: number;
	};
}
