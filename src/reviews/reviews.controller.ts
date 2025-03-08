import { Controller, Get, Post, Body, Param, Req } from "@nestjs/common";

import { ReviewsService } from "./reviews.service";
import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { IRequest } from "src/_interfaces/request.interface";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("products/:id/reviews")
@ApiBearerAuth("Authorization")
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Post()
	async create(
		@Req() req: IRequest,
		@Param("id") productId: string,
		@Body() dto: CreateProductReviewDto,
	) {
		dto.product = productId;
		dto.user = req.user.id;

		return this.reviewsService.create(dto);
	}

	@Get()
	async getAll(@Param("id") productId: string) {
		return this.reviewsService.findAll({ product: productId });
	}
}
