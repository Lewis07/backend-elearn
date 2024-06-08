import { Body, Controller, Post } from "@nestjs/common";
import { StripePaymentIntentService } from "../service/stripe-payment-intent.service";
import { SaveStripePaymentIntentDto } from "../dto/save-stripe-payment-intent.dto";

@Controller('stripe/payment-intents')
export class StripePaymentIntentsController {
    constructor(private stripePaymentIntentService: StripePaymentIntentService) {}

    @Post("add")
    async add(@Body() saveStripePaymentIntentDto: SaveStripePaymentIntentDto) {
        return await this.stripePaymentIntentService.create(saveStripePaymentIntentDto);
    }
}