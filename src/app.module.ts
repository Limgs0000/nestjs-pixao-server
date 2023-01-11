import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${__dirname}/../envs/.env.${process.env.NODE_ENV}`,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL, { dbName: 'pixao' }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
