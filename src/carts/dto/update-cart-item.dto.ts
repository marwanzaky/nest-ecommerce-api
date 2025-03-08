import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class UpdateCartItemDto {
	@ApiProperty()
	@IsNumber()
	@Min(1)
	@IsNotEmpty()
	readonly quantity!: number;
}
