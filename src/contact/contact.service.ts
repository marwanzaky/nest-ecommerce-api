import { Injectable } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class ContactService {
	constructor(private mailerService: MailerService) {}

	async sendMail(sendMailOptions: ISendMailOptions) {
		this.mailerService.sendMail(sendMailOptions);
	}
}
