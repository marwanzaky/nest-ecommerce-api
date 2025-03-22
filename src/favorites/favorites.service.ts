import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import mongoose, { Model } from "mongoose";

import { Favorite } from "./entities/favorite.entity";

@Injectable()
export class FavoritesService {
	constructor(
		@InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
	) {}

	async create(userId: string, productId: string): Promise<Favorite> {
		const favorite = await this.favoriteModel.create({
			user: userId,
			product: productId,
		});

		return favorite.save();
	}

	async find({ user }: { user: string }): Promise<Favorite[]> {
		return this.favoriteModel.find({ user });
	}

	findByIdAndDelete(productId: string): Promise<Favorite | null> {
		return this.favoriteModel.findOneAndDelete({
			product: new mongoose.Types.ObjectId(productId),
		});
	}
}
