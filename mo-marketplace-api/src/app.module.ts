import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to PostgreSQL
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    AuthModule,
    UsersModule,
    ProductsModule,
    VariantsModule,
  ],
})
export class AppModule {}
