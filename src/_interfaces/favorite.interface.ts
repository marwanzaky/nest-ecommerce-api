import mongoose from "mongoose";

export interface IFavorite {
	_id: string;
	user: mongoose.Schema.Types.ObjectId;
	product: mongoose.Schema.Types.ObjectId;
}
