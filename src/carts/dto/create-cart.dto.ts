import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsInt,
	IsMongoId,
	IsNotEmpty,
	IsString,
	Min,
	ValidateNested,
} from "class-validator";

class CartItemDto {
	@ApiProperty({
		description: "Product ID",
		example: "65a7f1b2c3d4e5f67890abcd",
	})
	@IsMongoId()
	@IsNotEmpty()
	product!: string;

	@ApiProperty({ description: "Quantity of the product", example: 1 })
	@IsInt()
	@Min(1)
	quantity!: number;
}

export class CreateCartDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	readonly user!: string;

	@ApiProperty({ type: [CartItemDto], description: "Array of cart items" })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItemDto)
	readonly items!: CartItemDto[];
}
