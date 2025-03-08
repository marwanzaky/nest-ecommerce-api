import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly name!: string;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	readonly price!: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	readonly priceCompare!: number;

	@ApiProperty()
	@IsString({ each: true })
	@IsNotEmpty()
	readonly imgUrls!: string[];

	@ApiProperty()
	@IsString({ each: true })
	@IsNotEmpty()
	readonly description!: string;
}
