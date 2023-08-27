import {
  Controller,
  Post,
  Res,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import RequestWithRawBody from './interfaces/requestRawBody.interface';
import Stripe from 'stripe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/saveCard')
  async saveCard(@Res() res): Promise<any> {
    const session = await this.appService.saveCard();
    res.redirect(303, session.url);
  }

  @Post()
  async payments(@Res() res): Promise<any> {
    const session = await this.appService.payment();
    res.redirect(303, session.url);
  }

  @Post('webhook')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    console.log('call webhook', request.body);
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    console.log(1);
    const event = await this.appService.constructEventFromPayload(
      signature,
      request.rawBody,
    );
    console.log('event', event);
    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.created'
    ) {
      const data = event.data.object as Stripe.Subscription;

      const customerId: string = data.customer as string;
      const subscriptionStatus = data.status;

      console.log('customerId', customerId);
      console.log('subscriptionStatus', subscriptionStatus);
      // await this.usersService.updateMonthlySubscriptionStatus(
      //   customerId,
      //   subscriptionStatus,
      // );
    }
  }
}
