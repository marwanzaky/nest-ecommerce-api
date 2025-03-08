import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ICart } from "src/_interfaces/cart.interface";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
})
export class Cart extends Document implements Omit<ICart, "_id"> {
	@Prop({
		type: mongoose.Schema.ObjectId,
		ref: User.name,
		required: [true, "A review must belong to a user"],
	})
	user!: mongoose.Schema.Types.ObjectId;

	@Prop([
		{
			product: {
				type: mongoose.Schema.ObjectId,
				ref: Product.name,
				required: [true, "Cart item must belong to a product"],
			},
			quantity: {
				type: Number,
				min: 1,
				required: [true, "Cart item must have a quantity"],
			},
		},
	])
	items!: {
		product: mongoose.Schema.Types.ObjectId;
		quantity: number;
	}[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre(/^find/, function (next) {
	(this as any).populate({
		path: "items.product",
		select: "name imgUrls price",
	});
	next();
});
