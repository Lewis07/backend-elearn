import { Controller, Post } from "@nestjs/common";
import { StripePaymentIntentService } from "../service/stripe-payment-intent.service";

@Controller('stripe/payment-intents')
export class StripePaymentIntentsController {
    constructor(private stripePaymentIntentService: StripePaymentIntentService) {}

    @Post("add")
    async add() {
        return await this.stripePaymentIntentService.create();
    }
}