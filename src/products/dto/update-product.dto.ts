import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly name?: string;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	readonly price?: number;

	@ApiProperty()
	@IsNumber()
	@IsOptional()
	readonly priceCompare?: number;

	@ApiProperty()
	@IsString({ each: true })
	@IsOptional()
	readonly imgUrls?: string[];

	@ApiProperty()
	@IsString()
	@IsOptional()
	readonly description?: string;

	@ApiProperty()
	@IsString({ each: true })
	@IsOptional()
	readonly tags?: string[];
}
