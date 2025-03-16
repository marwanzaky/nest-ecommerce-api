import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";
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

	@ApiProperty({ type: Boolean, example: false })
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === "true")
	readonly featured?: boolean;

	@ApiProperty({
		type: Number,
		example: 4,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	readonly limit?: number;
}
