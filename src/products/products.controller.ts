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
import { SupabaseService } from "src/products/supabase.service";

@Controller("products")
@ApiBearerAuth("Authorization")
export class ProductsController {
	constructor(
		private readonly productsService: ProductsService,
		private readonly supabaseService: SupabaseService,
	) {}

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
			excludeIds,
			minPrice,
			maxPrice,
			featured,
			limit,
			avgRatings,
		} = dto;

		return this.productsService.find({
			sort: {
				property: sortProperty,
				order: sortOrder,
			},
			query: {
				name: searchTerm,
				excludeIds,
				minPrice,
				maxPrice,
				featured,
				limit,
				avgRatings,
			},
		});
	}

	@Post()
	@ApiOperation({
		summary: "Create a new product",
	})
	async create(
		@Req() req: IRequest,
		@Body() createProductDto: CreateProductDto,
	) {
		const {
			name,
			price,
			priceCompare,
			description,
			imgUrls: imgBase64s,
			tags,
		} = createProductDto;

		const imgUrlPromises = await imgBase64s.map(async (imgBase64) => {
			const base64 = imgBase64.split("base64,")[1];
			const fileBuffer = Buffer.from(base64, "base64");
			const fileName = `product-imgs/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

			const { imgUrl } = await this.supabaseService.uploadFile(
				"uploads",
				fileName,
				fileBuffer,
				"image/png",
			);

			return imgUrl;
		});

		const imgUrls = await Promise.all(imgUrlPromises);

		return this.productsService.create(
			name,
			price,
			priceCompare,
			imgUrls,
			description,
			tags || [],
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
