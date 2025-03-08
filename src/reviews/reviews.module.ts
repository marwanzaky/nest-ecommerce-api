import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { Review, ReviewSchema } from "src/_entities/review.entity";
import { Product, ProductSchema } from "src/_entities/product.entity";
import { User, UserSchema } from "src/_entities/user.entity";
import { ProductsService } from "src/products/products.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Review.name, schema: ReviewSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: User.name, schema: UserSchema },
		]),
	],
	controllers: [ReviewsController],
	providers: [ReviewsService, ProductsService],
})
export class ReviewsModule {}
