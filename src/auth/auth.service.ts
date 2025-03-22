import {
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/users/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SignUpDto } from "./dto/signup.dto";
import { Model } from "mongoose";
import { LoginDto } from "./dto/login.dto";
import { compare } from "bcrypt";
import { IRequest } from "src/_interfaces/request.interface";
import { CartsService } from "src/carts/carts.service";
import { UsersService } from "src/users/users.service";
import { UserRole } from "src/_interfaces/user.interface";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private jwtService: JwtService,
		private configService: ConfigService,
		private cartsService: CartsService,
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService,
	) {}

	extractTokenFromHeader(request: IRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}

	async createAccessToken(userId: string, role: UserRole) {
		return await this.jwtService.sign(
			{ id: userId, role },
			{
				secret: this.configService.get("JWT_SECRET"),
				expiresIn: this.configService.get("JWT_EXPIRES"),
			},
		);
	}

	async signUp(signupDto: SignUpDto) {
		const { name, email, password } = signupDto;

		const user = await this.usersService.create(name, email, password);
		await this.cartsService.create(user.id, []);

		return { token: await this.createAccessToken(user.id, user.role) };
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		const user = await this.userModel
			.findOne({
				email,
			})
			.select("+password");

		if (!user) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new UnauthorizedException("Invalid email or password");
		}

		return { token: await this.createAccessToken(user.id, user.role) };
	}
}
