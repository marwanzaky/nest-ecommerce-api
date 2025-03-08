import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetAllProductsDto } from "./dto/get-all-products.dto";

import mongoose, { Model } from "mongoose";

import { Product } from "../_entities/product.entity";
import { Review } from "src/_entities/review.entity";

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<Product>,
		@InjectModel(Review.name) private reviewModel: Model<Review>,
	) {}

	async createProducts(createProductDto: CreateProductDto): Promise<Product> {
		const { name, price, priceCompare, imgUrls, description } =
			createProductDto;

		const user = await this.productModel.create({
			name,
			price,
			priceCompare,
			imgUrls,
			description,
		});

		return user.save();
	}

	async findAllProducts(
		getAllProductsDto: GetAllProductsDto,
	): Promise<Product[]> {
		const { sortProperty, sortOrder, searchTerm, minPrice, maxPrice } =
			getAllProductsDto;

		const sort: { [key: string]: 1 | -1 } = {};

		if (sortProperty && sortOrder) {
			sort[sortProperty] = sortOrder === "asc" ? 1 : -1;
		}

		const query: { [key: string]: any } = {};

		if (searchTerm) {
			query.name = { $regex: new RegExp(searchTerm, "i") };
		}

		if (minPrice !== undefined || maxPrice !== undefined) {
			query.price = {};

			if (minPrice !== undefined) query.price.$gte = minPrice;
			if (maxPrice !== undefined) query.price.$lte = maxPrice;
		}

		return this.productModel.find(query).sort(sort);
	}

	async findProduct(id: string): Promise<Product> {
		const user = await this.productModel.findById(id).populate("reviews");

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		return user;
	}

	updateProduct(
		id: string,
		updateProductDto: UpdateProductDto,
	): Promise<Product | null> {
		return this.productModel.findByIdAndUpdate(id, updateProductDto, {
			new: true,
			runValidators: true,
		});
	}

	removeProduct(id: string): Promise<Product | null> {
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
