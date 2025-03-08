import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateUserPasswordDto {
	@ApiProperty()
	@IsNotEmpty()
	readonly currentPassword!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly newPassword!: string;
}
