import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { UpdateProductDto } from "./dto/update-product.dto";

import mongoose, { Model } from "mongoose";

import { IProduct } from "src/_interfaces/product.interface";
import { Product } from "./entities/product.entity";
import { Review } from "src/reviews/entities/review.entity";

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<Product>,
		@InjectModel(Review.name) private reviewModel: Model<Review>,
	) {}

	async create(
		name: string,
		price: number,
		priceCompare: number,
		imgUrls: string[],
		description: string,
		user: string,
	): Promise<Product> {
		const product = await this.productModel.create({
			name,
			price,
			priceCompare,
			imgUrls,
			description,
			user,
		});

		return product.save();
	}

	async find(
		sort: {
			property?: keyof IProduct;
			order?: "asc" | "desc";
		},
		query: {
			ids?: string[];
			name?: string;
			user?: string;
			minPrice?: number;
			maxPrice?: number;
			featured?: boolean;
			limit?: number;
		},
	): Promise<Product[]> {
		const sortOptions: Record<string, 1 | -1> = {};

		if (sort.property && sort.order) {
			sortOptions[sort.property] = sort.order === "asc" ? 1 : -1;
		}

		const filter: Record<string, any> = {};

		if (query.user) {
			filter.user = new mongoose.Types.ObjectId(query.user);
		}

		if (query.name) {
			filter.name = { $regex: new RegExp(query.name, "i") };
		}

		if (query.minPrice !== undefined || query.maxPrice !== undefined) {
			filter.price = {};

			if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
			if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
		}

		if (query.featured !== undefined) {
			filter.featured = query.featured;
		}

		if (query.ids && query.ids.length > 0) {
			filter._id = {
				$in: query.ids.map((id) => new mongoose.Types.ObjectId(id)),
			};
		}

		const filteredProducts = this.productModel.find(filter).sort(sortOptions);

		if (query.limit !== undefined && query.limit > 0) {
			filteredProducts.limit(query.limit);
		}

		return filteredProducts;
	}

	async findById(id: string): Promise<Product> {
		const product = await this.productModel.findById(id).populate("reviews");

		if (!product) {
			throw new NotFoundException("Could not find the product");
		}

		return product;
	}

	findByIdAndUpdate(
		id: string,
		updateProductDto: UpdateProductDto,
	): Promise<Product | null> {
		return this.productModel.findByIdAndUpdate(id, updateProductDto, {
			new: true,
			runValidators: true,
		});
	}

	findByIdAndDelete(id: string): Promise<Product | null> {
		return this.productModel.findByIdAndDelete(id);
	}

	async calcAvgRatings(productId: string) {
		const stats = await this.reviewModel.aggregate([
			{
				$match: {
					product: new mongoose.Types.ObjectId(productId),
				},
			},
			{
				$group: {
					_id: "$product",
					numRating: { $sum: 1 },
					avgRating: { $avg: "$rating" },
				},
			},
		]);

		await this.productModel.findByIdAndUpdate(productId, {
			numReviews: stats.length > 0 ? stats[0].numRating : 0,
			avgRatings: stats.length > 0 ? stats[0].avgRating : 0,
		});
	}
}
