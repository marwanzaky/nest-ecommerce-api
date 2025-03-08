import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";

export class UpdateUserDto {
	@ApiProperty()
	@IsOptional()
	readonly name?: string;

	@ApiProperty()
	@IsEmail()
	@IsOptional()
	readonly email?: string;

	@ApiProperty()
	@IsOptional()
	readonly photo?: string;
}
