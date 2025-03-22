import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../_interfaces/user.interface";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
