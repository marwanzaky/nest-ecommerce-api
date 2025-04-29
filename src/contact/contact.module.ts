import { Module } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ContactController } from "./contact.controller";

@Module({
	imports: [],
	controllers: [ContactController],
	providers: [ContactService],
})
export class ContactModule {}
