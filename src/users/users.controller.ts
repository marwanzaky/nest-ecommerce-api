import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { IRequest } from "src/_interfaces/request.interface";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { ProductsService } from "src/products/products.service";

@Controller("users")
@ApiBearerAuth("Authorization")
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly productsService: ProductsService,
	) {}

	@Get("/me")
	@ApiOperation({
		summary: "Get the authenticated user's info",
	})
	async getMe(@Req() request: IRequest) {
		return this.usersService.findUser(request.user.id);
	}

	@Get("/me/products")
	@ApiOperation({
		summary: "Get all products of the authenticated user",
	})
	async getMeProducts(@Req() request: IRequest) {
		return this.productsService.find({}, { user: request.user.id });
	}

	@Patch("/updateMe")
	@ApiOperation({
		summary: "Update the authenticated user's info",
	})
	async updateMe(
		@Req() request: IRequest,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.updateUser(request.user.id, updateUserDto);
	}

	@Delete("/deleteMe")
	@ApiOperation({
		summary: "Delete the authenticated user's account",
	})
	async removeMe(@Req() request: IRequest) {
		return this.usersService.removeUser(request.user.id);
	}

	@Patch("/updateMyPassword")
	@ApiOperation({
		summary: "Update the authenticated user's password",
	})
	async updateMyPassword(
		@Req() request: IRequest,
		@Body() updateUserPasswordDto: UpdateUserPasswordDto,
	) {
		return this.usersService.updateUserPassword(
			request.user.id,
			updateUserPasswordDto,
		);
	}

	@Get()
	@ApiOperation({
		summary: "Get all users (admin-only)",
	})
	async getAllUsers() {
		return this.usersService.findAllUsers();
	}

	@Post()
	@ApiOperation({
		summary: "Create a new user (admin-only)",
	})
	async createUsers(@Body() createUserDto: CreateUserDto) {
		const { name, email, password } = createUserDto;
		return this.usersService.create(name, email, password);
	}

	@Get(":id")
	@ApiOperation({
		summary: "Get a specific user (admin-only)",
	})
	async getUser(@Param("id") id: string) {
		return this.usersService.findUser(id);
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update a specific user (admin-only)",
	})
	async updateUser(
		@Param("id") id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.updateUser(id, updateUserDto);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Remove a specific user (admin-only)",
	})
	async removeUser(@Param("id") id: string) {
		return this.usersService.removeUser(id);
	}
}
