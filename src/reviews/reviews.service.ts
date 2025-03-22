import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { ProductsService } from "src/products/products.service";
import { Review } from "./entities/review.entity";

@Injectable()
export class ReviewsService {
	constructor(
		@InjectModel(Review.name) private reviewModel: Model<Review>,
		private productService: ProductsService,
	) {}

	async create(dto: CreateProductReviewDto): Promise<Review> {
		const { user, product, rating, description } = dto;

		const review = await this.reviewModel.create({
			product,
			rating,
			description,
			user,
		});

		await review.save();

		await this.productService.calcAvgRatings(product);

		return review;
	}

	async findAll(query: { product: string }): Promise<Review[]> {
		return this.reviewModel.find(query);
	}

	async findProduct(id: string): Promise<Review> {
		const user = await this.reviewModel.findById(id);

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		return user;
	}

	remove(id: string): Promise<Review | null> {
		return this.reviewModel.findByIdAndDelete(id);
	}
}
