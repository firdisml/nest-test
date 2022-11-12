import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { StripeModule } from './common/stripe/stripe.module';
import { PaymentModule } from './payment/payment.module';
import { PostModule } from './post/post.module';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    StripeModule.forRoot(
      'sk_test_51LuzzFC3J13Tnkehs6sHdAP3GWmo0XaOSSbFnJu1D9NynmdW9y6qig5NDbeUXrKHbUwhUS0CSua0wPwlZWZNhGjF008gfZgazN',
      { apiVersion: '2022-08-01' },
    ),
    CacheModule.registerAsync<any>({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'containers-us-west-120.railway.app',
            port: 7723,
          },
          password: 'RbZt9VPSXrIfRvX2jpka',
        });
        return {
          store: {
            create: () => store,
          },
        };
      },
    }),
    PaymentModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
