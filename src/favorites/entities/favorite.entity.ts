import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

import { IFavorite } from "src/_interfaces/favorite.interface";

import { User } from "../../_entities/user.entity";
import { Product } from "../../_entities/product.entity";

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
})
export class Favorite extends Document implements Omit<IFavorite, "_id"> {
	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Product.name,
		required: [true, "A review must belong to a user"],
	})
	product!: mongoose.Schema.Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
