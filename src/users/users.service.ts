import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../_entities/user.entity";
import { Model } from "mongoose";
import { compare } from "bcrypt";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private authService: AuthService,
	) {}

	async updateUserPassword(
		id: string,
		updateUserPasswordDto: UpdateUserPasswordDto,
	): Promise<{ token: string } | null> {
		const { currentPassword, newPassword } = updateUserPasswordDto;

		const user = await this.userModel.findById(id).select("+password");

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		const passwordMatch = await compare(currentPassword, user.password);

		if (passwordMatch === false) {
			throw new UnauthorizedException("Incorrect current password");
		}

		user.password = newPassword;

		await user.save();

		return { token: await this.authService.createAccessToken(user.id) };
	}

	async create(name: string, email: string, password: string): Promise<User> {
		const user = await this.userModel.create({
			name,
			email,
			password,
		});

		return user.save();
	}

	async findAllUsers(): Promise<User[]> {
		return this.userModel.find();
	}

	async findUser(id: string): Promise<User> {
		const user = await this.userModel.findById(id);

		if (!user) {
			throw new NotFoundException("Could not find the user");
		}

		return user;
	}

	updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
		return this.userModel.findByIdAndUpdate(id, updateUserDto, {
			new: true,
			runValidators: true,
		});
	}

	removeUser(id: string): Promise<User | null> {
		return this.userModel.findByIdAndDelete(id);
	}
}
