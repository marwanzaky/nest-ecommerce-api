import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Product } from "./product.entity";
import { User } from "./user.entity";

interface IReview {
	_id: string;
	rating: number;
	description: string;
	product: mongoose.Schema.Types.ObjectId;
	user: mongoose.Schema.Types.ObjectId;
	createdAt: Date;
}

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
})
export class Review extends Document implements Omit<IReview, "_id"> {
	@Prop({
		type: Number,
		min: 1,
		max: 5,
		required: [true, "A review must have a rating"],
	})
	rating!: number;

	@Prop({
		type: String,
		required: [true, "A review must have a description"],
		trim: true,
	})
	description!: string;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: Product.name,
		required: [true, "A review must belong to a product"],
	})
	product!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: Date,
		default: Date.now(),
	})
	createdAt!: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(/^find/, function (next) {
	(this as any)
		.populate({
			path: "product",
			select: "name",
		})
		.populate({
			path: "user",
			select: "name photo",
		});

	next();
});
