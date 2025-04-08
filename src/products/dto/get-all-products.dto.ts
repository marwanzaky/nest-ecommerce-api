import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from "class-validator";
import { IProduct } from "src/_interfaces/product.interface";

export class GetAllProductsDto {
	@ApiPropertyOptional({ type: String, example: "price" })
	@IsOptional()
	readonly sortProperty?: keyof IProduct;

	@ApiPropertyOptional({ type: String, example: "price" })
	@IsOptional()
	readonly sortOrder?: "asc" | "desc";

	@ApiPropertyOptional({ type: String, example: "iPhone" })
	@IsOptional()
	@IsString()
	readonly searchTerm?: string;

	@ApiPropertyOptional({ type: [String] })
	@IsOptional()
	@IsArray()
	@IsMongoId({ each: true })
	@Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
	readonly excludeIds?: string[];

	@ApiPropertyOptional({ type: Number, example: 499 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly minPrice?: number;

	@ApiPropertyOptional({ type: Number, example: 799 })
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	readonly maxPrice?: number;

	@ApiPropertyOptional({ type: Boolean, example: false })
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === "true")
	readonly featured?: boolean;

	@ApiPropertyOptional({
		type: Number,
		example: 4,
	})
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Type(() => Number)
	readonly limit?: number;
}
