import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Req,
	Patch,
} from "@nestjs/common";

import { CartsService } from "./carts.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { IRequest } from "src/_interfaces/request.interface";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { Roles } from "src/_decorators/roles.decorator";

@Controller("carts")
@ApiBearerAuth("Authorization")
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@Get("/me")
	async getMe(@Req() request: IRequest) {
		return this.cartsService.findOne({ user: request.user.id });
	}

	@Post()
	// @Roles("admin")
	async create(@Body() dto: CreateCartDto) {
		const { user, items } = dto;
		return this.cartsService.create(user, items);
	}

	@Get()
	// @Roles("admin")
	async find() {
		return this.cartsService.find();
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
}
