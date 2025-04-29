import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { ContactDto } from "./dto/contact.dto";

import { Public } from "src/auth/auth.guard";
import { ContactService } from "./contact.service";

@Controller("contact")
export class ContactController {
	constructor(private contactService: ContactService) {}

	@Post()
	@Public()
	@ApiOperation({
		summary: "Send a contact form message",
	})
	async create(@Body() body: ContactDto) {
		const { name, email, message, subject } = body;

		return this.contactService.sendMail({
			from: email,
			to: process.env.EMAIL_TO,
			subject: `${subject} (${name})`,
			html: `
				<p> <strong>Name:</strong> ${name}</p>
				<p> <strong>Email:</strong> ${email}</p>
				<p> <strong>Subject:</strong> ${subject}</p>
				<p> <strong>Message:</strong> ${message.replace(/\n/g, "<br/>")}</p>
			`,
		});
	}
}
