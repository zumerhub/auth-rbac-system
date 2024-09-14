import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from '../users/schemas/user.schema';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Ensures environment variables are available globally
    }),
    // Passport module for JWT authentication strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JWT module configuration with async setup from ConfigService
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES'),
        },
      }),
    }),
    // Mongoose for User model/schema
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    // Redis module configuration using async setup from ConfigService
    NestRedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('REDIS_HOST'),  // Fix typo
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          ttl: 60 * 60, // TTL for 1 hour session expiration
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy ],
  exports: [PassportModule], // Exporting PassportModule for use in other modules
})
export class AuthModule {}
