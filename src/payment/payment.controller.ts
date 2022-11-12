import {
  Controller,
  Body,
  UseGuards,
  Post,
  Inject,
  RawBodyRequest,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AccessGuard } from 'src/common/guard/access.guard';
import { AccessTokenDecorator } from 'src/common/decorator/access.decorator';
import { StripeDecorator } from 'src/common/decorator/stripe.decorator';
import { Request } from 'express';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from 'src/common/option';

@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
  ) {}

  secret =
    'whsec_a1958dd8522610d8078a952f2cf2eda68ff427f6ac722d86f5ed08ee2a4136a3';

  @Post('checkout')
  @UseGuards(AccessGuard)
  checkout(
    @AccessTokenDecorator('user_id') user_id: string,
    @AccessTokenDecorator('email') email: string,
    @Body('credit') credit: string,
  ) {
    return this.paymentService.checkout(email, user_id, credit);
  }

  //Only called from stripe webhook
  @Post('complete')
  complete(
    @Req() req: RawBodyRequest<Request>,
    @StripeDecorator('stripe-signature') stripeSigniture: string,
  ) {
    try {
      const response = this.stripe.webhooks.constructEvent(
        req.rawBody,
        stripeSigniture,
        this.secret,
      );

      if (response.type === 'checkout.session.completed') {
        const session = response.data.object;

        if (session) {
          this.paymentService.store(session);
        }
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
