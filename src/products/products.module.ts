import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./entities/product.entity";
import { Review, ReviewSchema } from "src/reviews/entities/review.entity";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
	],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService],
})
export class ProductsModule {}
