import { Module } from "@nestjs/common";
import { CartsService } from "./carts.service";
import { CartsController } from "./carts.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "src/_entities/cart.entity";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
	],
	controllers: [CartsController],
	providers: [CartsService],
	exports: [CartsService],
})
export class CartsModule {}
