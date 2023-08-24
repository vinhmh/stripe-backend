import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-08-16',
    });
  }

  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async payment(): Promise<any> {
    console.log('secret', this.configService.get('STRIPE_SECRET_KEY'));
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1Nia87DGlDzXRorA91ePBCUJ',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000?success=true`,
      cancel_url: `http://localhost:3000?canceled=true`,
    });

    return session;
  }

  async saveCard(): Promise<any> {
    console.log('secret', this.configService.get('STRIPE_SECRET_KEY'));
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'setup',
      customer: 'cus_OVYzQzI6csPAwA',
      success_url:
        'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });

    return session;
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  public async charge(
    amount: number,
    paymentMethodId: string,
    customerId: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      confirm: true,
    });
  }
}
