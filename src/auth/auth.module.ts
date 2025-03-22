import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/entities/user.entity";
import { CartsModule } from "src/carts/carts.module";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					secret: config.get<string>("JWT_SECRET"),
					signOptions: {
						expiresIn: config.get<string>("JWT_EXPIRES"),
					},
				};
			},
		}),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		CartsModule,
		forwardRef(() => UsersModule),
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
