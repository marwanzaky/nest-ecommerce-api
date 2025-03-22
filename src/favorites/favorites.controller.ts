import { Controller, Get, Post, Req, Delete, Param } from "@nestjs/common";

import { FavoritesService } from "./favorites.service";
import { IRequest } from "src/_interfaces/request.interface";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CreateFavoriteDto } from "./dto/create-favorite.dto";
import { ProductsService } from "src/products/products.service";

@Controller("favorites")
@ApiBearerAuth("Authorization")
export class FavoritesController {
	constructor(
		private readonly favoritesService: FavoritesService,
		private readonly productsService: ProductsService,
	) {}

	@Get()
	@ApiOperation({
		summary: "Get all favorite products",
	})
	async get(@Req() request: IRequest) {
		const items = await this.favoritesService.find({ user: request.user.id });

		if (items.length > 0) {
			return this.productsService.find(
				{},
				{ ids: items.map((item) => item.product.toString()) },
			);
		}

		return [];
	}

	@Post("/:productId")
	@ApiOperation({
		summary: "Add a product to favorites",
	})
	async create(@Req() request: IRequest, @Param() dto: CreateFavoriteDto) {
		const { productId } = dto;
		await this.favoritesService.create(request.user.id, productId);
		return this.productsService.findById(productId);
	}

	@Delete("/:productId")
	@ApiOperation({
		summary: "Remove a product from favorites",
	})
	async remove(@Param("productId") productId: string) {
		return this.favoritesService.findByIdAndDelete(productId);
	}
}
