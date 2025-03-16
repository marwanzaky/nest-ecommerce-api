import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateFavoriteDto {
	@ApiProperty()
	@IsMongoId()
	@IsNotEmpty()
	readonly productId!: string;
}
