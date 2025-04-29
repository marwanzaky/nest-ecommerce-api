import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Stripe } from "stripe";

@Injectable()
export class PaymentsService {
	private stripe!: Stripe;

	constructor() {
		if (process.env.STRIPE_PRIVATE_KEY) {
			this.stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
		}
	}

	async createCheckoutSession(
		lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
	): Promise<Stripe.Checkout.Session> {
		try {
			return await this.stripe.checkout.sessions.create({
				line_items: lineItems,
				mode: "payment",
				success_url: `${process.env.CLIENT_URL}/success`,
				cancel_url: `${process.env.CLIENT_URL}/cancel`,
				payment_method_types: ["card"],
			});
		} catch (error) {
			console.error("Error creating session:", error);
			throw new InternalServerErrorException(
				"Failed to create checkout session",
			);
		}
	}
}
