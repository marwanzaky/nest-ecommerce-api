import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { IProduct } from "src/_interfaces/product.interface";
import { User } from "src/users/entities/user.entity";

@Schema({
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
	timestamps: true,
})
export class Product extends Document implements Omit<IProduct, "_id"> {
	@Prop({
		type: String,
		required: [true, "A product must have a name"],
		unique: true,
		trim: true,
	})
	name!: string;

	@Prop({
		type: Number,
		required: [true, "A product must have a price"],
	})
	price!: number;

	@Prop({
		type: Number,
		required: [true, "A product must have a priceCompare"],
	})
	priceCompare!: number;

	@Prop({
		type: Number,
		default: 0,
	})
	avgRatings!: number;

	@Prop({
		type: Number,
		default: 0,
	})
	numReviews!: number;

	@Prop({
		type: [String],
		required: true,
	})
	imgUrls!: string[];

	@Prop({
		type: String,
		required: [true, "A product must have a description"],
		trim: true,
	})
	description!: string;

	@Prop({
		type: [String],
		required: [true, "A product must have tags"],
		trim: true,
	})
	tags!: string[];

	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A product must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop({
		type: Boolean,
		default: false,
	})
	featured!: boolean;

	@Virtual({
		get: function (this: Product) {
			const discount = this.priceCompare - this.price;
			const discountPercent = (discount / this.priceCompare) * 100;
			return `${Math.round(discountPercent)}%`;
		},
	})
	discount!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "product",
	localField: "_id",
});
