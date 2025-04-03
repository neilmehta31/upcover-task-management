import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      PassportModule.register({ defaultStrategy: 'jwt' })],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI') || 'mongodb://127.0.0.1:27017/task-manager'
    }),
    inject: [ConfigService]
  }), AuthModule, TaskModule, ThrottlerModule.forRoot({
    throttlers: [{
      ttl: 60000,
      limit: 10
    }]
  }), CommonModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AppModule { }
