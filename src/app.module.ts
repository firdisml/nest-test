import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { StripeModule } from './common/stripe/stripe.module';
import { PaymentModule } from './payment/payment.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    StripeModule.forRoot(
      'sk_test_51LuzzFC3J13Tnkehs6sHdAP3GWmo0XaOSSbFnJu1D9NynmdW9y6qig5NDbeUXrKHbUwhUS0CSua0wPwlZWZNhGjF008gfZgazN',
      { apiVersion: '2022-08-01' },
    ),
    PaymentModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
