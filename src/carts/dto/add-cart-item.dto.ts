import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Min } from "class-validator";

export class AddCartItemDto {
	@ApiProperty()
	@IsNumber()
	@Min(1)
	@IsOptional()
	readonly quantity?: number;

	// Params
	userId!: string;
	productId!: string;
}
