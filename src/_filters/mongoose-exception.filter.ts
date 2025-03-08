import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";

@Catch(Error)
export class MongooseExceptionFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception.name === "MongoServerError") {
			switch (exception.code) {
				case 11000: // Duplicate key error
					const field = Object.keys(exception.keyPattern)[0];
					return response.status(409).json({
						statusCode: 409,
						message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
						error: "Conflict",
					});

				default:
					return response.status(500).json({
						statusCode: 500,
						message: "A database error occurred",
						error: "Internal Server Error",
					});
			}
		}

		if (exception.name === "ValidationError") {
			const messages = Object.values(exception.errors).map(
				(err: any) => err.message,
			);

			return response.status(400).json({
				statusCode: 400,
				message: messages,
				error: "Bad Request",
			});
		}

		if (exception.name === "UnauthorizedException") {
			return response.status(exception.status).json(exception.response);
		}

		response.status(500).json({
			statusCode: 500,
			message: "Internal server error",
		});
	}
}
