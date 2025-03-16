import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	Req,
} from "@nestjs/common";

import { ProductsService } from "./products.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { GetAllProductsDto } from "./dto/get-all-products.dto";
import { Public } from "src/auth/auth.guard";
import { IRequest } from "src/_interfaces/request.interface";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("products")
@ApiBearerAuth("Authorization")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get("me")
	async me(@Req() req: IRequest) {
		return this.productsService.find({}, { user: req.user.id });
	}

	@Post()
	async create(
		@Req() req: IRequest,
		@Body() createProductDto: CreateProductDto,
	) {
		const { name, price, priceCompare, description, imgUrls } =
			createProductDto;

		return this.productsService.create(
			name,
			price,
			priceCompare,
			imgUrls,
			description,
			req.user.id,
		);
	}

	@Get()
	@Public()
	async find(@Query() dto: GetAllProductsDto) {
		const {
			sortProperty,
			sortOrder,
			searchTerm,
			minPrice,
			maxPrice,
			featured,
			limit,
		} = dto;

		return this.productsService.find(
			{
				property: sortProperty,
				order: sortOrder,
			},
			{
				name: searchTerm,
				minPrice,
				maxPrice,
				featured,
				limit,
			},
		);
	}

	@Get(":id")
	@Public()
	async findById(@Param("id") id: string) {
		return this.productsService.findById(id);
	}

	@Patch(":id")
	async update(
		@Param("id") id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsService.findByIdAndUpdate(id, updateProductDto);
	}

	@Delete(":id")
	async removeProduct(@Param("id") id: string) {
		return this.productsService.findByIdAndDelete(id);
	}
}
