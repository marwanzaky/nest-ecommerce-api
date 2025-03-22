import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IRequest } from "src/_interfaces/request.interface";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.get<string[]>(
			"roles",
			context.getHandler(),
		);
		if (!requiredRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest<IRequest>();
		const user = request.user;

		if (!user || !user.role || !requiredRoles.includes(user.role)) {
			throw new ForbiddenException(
				"You do not have permission to access this resource",
			);
		}

		return true;
	}
}
