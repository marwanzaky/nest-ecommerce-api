import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpDto {
	@ApiProperty()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsEmail()
	readonly email!: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly password!: string;
}
