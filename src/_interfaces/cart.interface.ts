import mongoose from "mongoose";

export interface ICart {
	_id: string;
	user: mongoose.Schema.Types.ObjectId;
	items: {
		product: mongoose.Schema.Types.ObjectId;
		quantity: number;
	}[];
}
