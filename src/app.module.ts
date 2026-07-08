import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { Role } from './role/entities/role.entity';
import { EndpointModule } from './endpoint/endpoint.module';
import { Endpoint } from './endpoint/entities/endpoint.entity';
import { ProductModule } from './product/product.module';
import { PermissionsModule } from './permissions/permissions.module';
import { Permission } from './permissions/entities/permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService:ConfigService) => ({
        type: 'postgres',
        // host: configService.get("DB_HOST"),
        // port: +configService.get("DB_PORT"),
        // username: configService.get("DB_USERNAME"),
        // password: configService.get("DB_PASSWORD"),
        // database: configService.get("DB_NAME"),
        host:'localhost',
        port:5432, 
        username:'postgres',
        password:"090908",
        database:"ecommerce_nest",
        entities: [
          User,
          Category,
          Role,
          Endpoint,
          Permission
        ],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    UserModule,
    CategoryModule,
    AuthModule,
    RoleModule,

    EndpointModule,

    ProductModule,

    PermissionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
