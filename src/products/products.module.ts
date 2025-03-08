import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "../_entities/product.entity";
import { Review, ReviewSchema } from "src/_entities/review.entity";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
	],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
