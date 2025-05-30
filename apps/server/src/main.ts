import { facilitator } from '@coinbase/x402';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { Resource, paymentMiddleware } from 'x402-express';

import { AppModule } from './modules/app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);

  const payTo = process.env.ADDRESS as `0x${string}`;

  const facilitatorUrl = process.env.FACILITATOR_URL as Resource;
  let network = process.env.NETWORK || 'base-sepolia';

  if (process.env.NODE_ENV === 'production') {
    network = 'base';
  }

  if (!facilitatorUrl || !payTo) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://suite.getgrowly.app',
      'https://www.suite.getgrowly.app',
      'https://getgrowly.app',
      'https://www.getgrowly.app',
      'https://api.getgrowly.app',
      'https://www.api.getgrowly.app',
    ],
  });

  const facilitatorOptions =
    process.env.NODE_ENV === 'production' ? facilitator : { url: facilitatorUrl };
  app.use(
    paymentMiddleware(
      payTo,
      {
        // Route configurations for protected endpoints
        'POST /growly': {
          // USDC amount in dollars
          price: '$0.001',
          network,
        },
      },
      facilitatorOptions
    )
  );

  app.enableCors();
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap().catch(err => {
  console.error(err);
});
