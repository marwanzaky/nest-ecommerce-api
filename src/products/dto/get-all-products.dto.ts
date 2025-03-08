import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { IProduct } from "src/_interfaces/product.interface";

export class GetAllProductsDto {
	@ApiProperty({ type: String, example: "price" })
	@IsOptional()
	readonly sortProperty?: keyof IProduct;

	@ApiProperty({ type: String, example: "price" })
	@IsOptional()
	readonly sortOrder?: "asc" | "desc";

	@ApiProperty({ type: String, example: "iPhone" })
	@IsOptional()
	readonly searchTerm?: string;

	@ApiProperty({ type: Number, example: 499 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly minPrice?: number;

	@ApiProperty({ type: Number, example: 799 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly maxPrice?: number;
}
