import { forwardRef, Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { ProductsModule } from "src/products/products.module";

@Module({
	imports: [forwardRef(() => ProductsModule)],
	controllers: [PaymentsController],
	providers: [PaymentsService],
})
export class PaymentsModule {}
