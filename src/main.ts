import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketIoAdapter } from './adapters/socket-io.adapters';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter(new WsAdapter(app));
  // app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useWebSocketAdapter(new IoAdapter(app));
  app.useStaticAssets('resources');
  await app.listen(7777);
}
bootstrap();
