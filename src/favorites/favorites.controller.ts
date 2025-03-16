import {
	Controller,
	Get,
	Post,
	Body,
	Req,
	Delete,
	Param,
} from "@nestjs/common";

import { FavoritesService } from "./favorites.service";
import { IRequest } from "src/_interfaces/request.interface";
import { ApiBearerAuth } from "@nestjs/swagger";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { ProductsService } from "src/products/products.service";

@Controller("favorites")
@ApiBearerAuth("Authorization")
export class FavoritesController {
	constructor(
		private readonly favoritesService: FavoritesService,
		private readonly productsService: ProductsService,
	) {}

	@Get("/me")
	async getMe(@Req() request: IRequest) {
		const items = await this.favoritesService.find({ user: request.user.id });
		return this.productsService.find(
			{},
			{ ids: items.map((item) => item.product.toString()) },
		);
	}

	@Post()
	async create(@Req() request: IRequest, @Body() dto: CreateFavoriteDto) {
		const { productId } = dto;
		await this.favoritesService.create(request.user.id, productId);
		return this.productsService.findById(productId);
	}

	@Delete("/:id")
	async remove(@Param("id") productId: string) {
		return this.favoritesService.findByIdAndDelete(productId);
	}
}
