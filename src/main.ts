import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';

async function bootstrap() {
  //AWS S3
  config.update({
    accessKeyId: 'AKIAVMEL2X3XS25G52FG',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
  });

  //NEST
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  //PRISMA
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  //COOKIES
  app.use(cookieParser());

  //CORS
  app.enableCors({
    origin: ['https://www.firdausismail.online'],
    methods: ['GET', 'POST'],
    credentials: true,
  });

  //PORT
  await app.listen(process.env.PORT || 3000);
}

//BOOTSTRAP
bootstrap();
