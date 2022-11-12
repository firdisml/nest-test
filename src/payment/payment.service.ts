import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { STRIPE_CLIENT } from 'src/common/option';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private prisma: PrismaService,
  ) {}

  async checkout(email: string, user_id: string, credit: string) {
    //Create payment session
    const session = await this.stripe.checkout.sessions.create({
      line_items: [{ price: 'price_1LzPxhC3J13TnkehVXwawAAK', quantity: 1 }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      metadata: {
        email: email,
        user_id: user_id,
        credit: credit,
      },
    });
    //Return checkout url for front end
    return { checkout: session.url };
  }

  async store(session: any) {
    //Store completed payment details in database
    const transaction = await this.prisma.payment.create({
      data: {
        user_id: session.metadata.user_id,
        stripe_id: session.payment_intent,
        credit: parseInt(session.metadata.credit),
        productId: '8c5d6c37-2ad1-4c62-abc2-491ed734c664',
      },
    });
    //Update user's balance in database
    await this.balance(transaction.user_id, transaction.credit);
  }

  async balance(user_id: string, value: number) {
    //Update user's balance in database
    await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        balance: { increment: value },
      },
    });
  }
}
