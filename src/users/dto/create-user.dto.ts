import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
	@ApiProperty()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	readonly email!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly password!: string;
}
