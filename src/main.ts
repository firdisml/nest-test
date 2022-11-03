import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.use(cookieParser());
  app.enableCors({
    origin: ['https://www.firdausismail.online'],
    methods: ['GET', 'POST'],
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
