import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { GetAllCartsDto } from "./dto/get-all-carts.dto";

import mongoose, { Model } from "mongoose";

import { Cart } from "src/_entities/cart.entity";
import { AddCartItemDto } from "./dto/add-cart-item.dto";

@Injectable()
export class CartsService {
	constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

	async create(
		userId: string,
		items: {
			product: string;
			quantity: number;
		}[],
	): Promise<Cart> {
		const cart = await this.cartModel.create({
			user: userId,
			items,
		});

		return cart.save();
	}

	async upsertItem(dto: AddCartItemDto): Promise<Cart | null> {
		const { productId, userId, quantity = 1 } = dto;

		const cart = await this.cartModel.findOneAndUpdate(
			{
				user: new mongoose.Types.ObjectId(userId),
				"items.product": new mongoose.Types.ObjectId(productId),
			},
			{
				$inc: {
					"items.$.quantity": quantity,
				},
			},
			{
				new: true,
				runValidators: true,
			},
		);

		if (cart == undefined) {
			return await this.insertItem(userId, productId, quantity);
		}

		return cart;
	}

	async insertItem(
		userId: string,
		productId: string,
		quantity: number = 1,
	): Promise<Cart | null> {
		return this.cartModel.findOneAndUpdate(
			{
				user: new mongoose.Types.ObjectId(userId),
			},
			{
				$push: {
					items: {
						product: new mongoose.Types.ObjectId(productId),
						quantity,
					},
				},
			},
			{
				new: true,
				runValidators: true,
			},
		);
	}

	async updateItemQuantity(
		userId: string,
		productId: string,
		quantity: number,
	): Promise<Cart | null> {
		return this.cartModel.findOneAndUpdate(
			{
				user: new mongoose.Types.ObjectId(userId),
				"items.product": new mongoose.Types.ObjectId(productId),
			},
			{
				$set: { "items.$.quantity": quantity },
			},
			{ new: true, runValidators: true },
		);
	}

	async find({ user }: { user: string }): Promise<Cart | null> {
		return this.cartModel.findOne({ user });
	}

	async findAll(dto: GetAllCartsDto): Promise<Cart[]> {
		return this.cartModel.find();
	}

	remove(userId: string, productId: string): Promise<Cart | null> {
		return this.cartModel.findOneAndUpdate(
			{ user: new mongoose.Types.ObjectId(userId) },
			{ $pull: { items: { product: new mongoose.Types.ObjectId(productId) } } },
			{ new: true, runValidators: true },
		);
	}
}
