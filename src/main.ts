import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json } from "express";
import { MongooseExceptionFilter } from "./_filters/mongoose-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Middlewares
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors();
	app.use(json({ limit: "5mb" }));

	// Swagger config
	const config = new DocumentBuilder()
		.setTitle("SWAGGER API")
		.setVersion("1.0")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
			"Authorization",
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	// Filters
	// app.useGlobalFilters(new MongooseExceptionFilter());

	await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
