import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { ProductsModule } from "./products/products.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { CartsModule } from "./carts/carts.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { RolesGuard } from "./_guards/roles.guard";
import { PaymentsModule } from "./payments/payments.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { ContactModule } from "./contact/contact.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
			isGlobal: true,
		}),

		// Mongoose config
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				uri: config.get<string>("MONGODB_URI"),
			}),
		}),

		// Modules
		MailerModule.forRoot({
			transport: {
				host: process.env.EMAIL_HOST,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
			},
		}),

		AuthModule,
		UsersModule,
		ProductsModule,
		ReviewsModule,
		CartsModule,
		FavoritesModule,
		PaymentsModule,
		ContactModule,
	],
	providers: [
		JwtService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
