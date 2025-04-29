import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsInt,
	IsMongoId,
	IsNotEmpty,
	ValidateNested,
} from "class-validator";

class CreateCheckoutSessionItemDto {
	@ApiProperty()
	@IsMongoId()
	@IsNotEmpty()
	id!: string;

	@IsInt()
	@ApiPropertyOptional()
	quantity: number = 1;
}

export class CreateCheckoutSessionDto {
	@ApiProperty({ type: [CreateCheckoutSessionItemDto] })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateCheckoutSessionItemDto)
	readonly items!: CreateCheckoutSessionItemDto[];
}
