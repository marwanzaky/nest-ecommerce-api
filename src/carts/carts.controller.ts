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
import { IRequest } from "src/_interfaces/request.interface";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Controller("carts")
@ApiBearerAuth("Authorization")
export class CartsController {
	constructor(private readonly cartsService: CartsService) {}

	@Get()
	@ApiOperation({
		summary: "Get the current user's cart",
	})
	async get(@Req() request: IRequest) {
		return this.cartsService.findOne({ user: request.user.id });
	}

	@Post("items/:productId")
	@ApiOperation({
		summary: "Add a product to the user's cart",
	})
	async createItem(
		@Req() req: IRequest,
		@Param("productId") productId: string,
		@Body() dto: AddCartItemDto,
	) {
		dto.userId = req.user.id;
		dto.productId = productId;

		return this.cartsService.upsertItem(dto);
	}

	@Delete("items/:productId")
	@ApiOperation({
		summary: "Remove a product from the user's cart",
	})
	async deleteItem(
		@Req() req: IRequest,
		@Param("productId") productId: string,
	) {
		return this.cartsService.remove(req.user.id, productId);
	}

	@Patch("items/:productId/quantity")
	@ApiOperation({
		summary: "Update quantity of a product in the user's cart",
	})
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
}
