import { Request } from "express";

export interface IRequest extends Request {
	user: {
		id: string;
		iat: number;
		exp: number;
	};
}
