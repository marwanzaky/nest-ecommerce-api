import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateProductReviewDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly description!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Max(5)
	readonly rating!: number;

	// Params
	product!: string;
	user!: string;
}
