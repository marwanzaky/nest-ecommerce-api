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
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@Controller("products")
@ApiBearerAuth("Authorization")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	@Public()
	@ApiOperation({
		summary: "Get all products",
	})
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

	@Post()
	@ApiOperation({
		summary: "Create a new product",
	})
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

	@Get(":id")
	@Public()
	@ApiOperation({
		summary: "Get a single product by id",
	})
	async findById(@Param("id") id: string) {
		return this.productsService.findById(id);
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update a product",
	})
	async update(
		@Param("id") id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsService.findByIdAndUpdate(id, updateProductDto);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Delete a product",
	})
	async removeProduct(@Param("id") id: string) {
		return this.productsService.findByIdAndDelete(id);
	}
}
