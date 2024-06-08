interface metadataPaymentIntent {
  metadata: {
    purchase_id: string;
  };
}

export class SaveStripePaymentIntentDto {
  amount: number;
  currency: string;
  customer: string;
  metadata: metadataPaymentIntent;
}
