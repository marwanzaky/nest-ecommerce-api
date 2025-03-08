import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Query,
	Req,
	Patch,
} from "@nestjs/common";

import { CartsService } from "./carts.service";
import { GetAllCartsDto } from "./dto/get-all-carts.dto";
import { CreateCartDto } from "./dto/create-cart.dto";
import { IRequest } from "src/_interfaces/request.interface";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Controller("carts")
@ApiBearerAuth("Authorization")
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@Get("/me")
	async getMe(@Req() request: IRequest) {
		return this.cartsService.find({ user: request.user.id });
	}

	@Post()
	async create(@Body() dto: CreateCartDto) {
		const { user, items } = dto;
		return this.cartsService.create(user, items);
	}

	@Get()
	async getAll(@Query() dto: GetAllCartsDto) {
		return this.cartsService.findAll(dto);
	}

	@Post("items/:productId")
	async createItem(
		@Req() req: IRequest,
		@Param("productId") productId: string,
		@Body() dto: AddCartItemDto,
	) {
		dto.userId = req.user.id;
		dto.productId = productId;

		return this.cartsService.upsertItem(dto);
	}

	@Patch("items/:productId/quantity")
	async updateItemQuantity(
		@Req() req: IRequest,
		@Param("productId") productId: string,
		@Body() dto: UpdateCartItemDto,
	) {
		return this.cartsService.updateItemQuantity(
			req.user.id,
			productId,
			dto.quantity,
		);
	}

	@Delete("items/:productId")
	async deleteItem(
		@Req() req: IRequest,
		@Param("productId") productId: string,
	) {
		return this.cartsService.remove(req.user.id, productId);
	}

	// @Get(":id")
	// async getProduct(@Param("id") id: string) {
	// 	return this.productsService.findProduct(id);
	// }

	// @Patch(":id")
	// async updateProduct(
	// 	@Param("id") id: string,
	// 	@Body() updateProductDto: UpdateProductDto,
	// ) {
	// 	return this.productsService.updateProduct(id, updateProductDto);
	// }

	// @Delete(":id")
	// async removeProduct(@Param("id") id: string) {
	// 	return this.productsService.removeProduct(id);
	// }
}
