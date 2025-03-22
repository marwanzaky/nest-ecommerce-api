import { Controller, Get, Post, Body, Param, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { ReviewsService } from "./reviews.service";
import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { IRequest } from "src/_interfaces/request.interface";

@Controller("products/:id/reviews")
@ApiBearerAuth("Authorization")
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Get()
	@ApiOperation({
		summary: "Get all reviews for a product",
	})
	async findAll(@Param("id") productId: string) {
		return this.reviewsService.findAll({ product: productId });
	}

	@Post()
	@ApiOperation({
		summary: "Add a review for a product",
	})
	async create(
		@Req() req: IRequest,
		@Param("id") productId: string,
		@Body() dto: CreateProductReviewDto,
	) {
		dto.product = productId;
		dto.user = req.user.id;

		return this.reviewsService.create(dto);
	}
}
