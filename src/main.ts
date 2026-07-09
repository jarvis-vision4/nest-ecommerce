import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getAllRoutes } from 'utils/app.util';
import { Endpoint, HttpEndpoint } from './endpoint/entities/endpoint.entity';
import { Role } from './role/entities/role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT ?? 3000);

  const dataSource=app.get(DataSource)
  const server=app.getHttpServer();
  const router=server._events.request.router;
  const {routes}=getAllRoutes(router);
  const queryRunner=dataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await dataSource.query('TRUNCATE endpoint restart identity cascade')
    for(const route of routes){
      const [method,url]=route.split(' ');
      queryRunner.manager.createQueryBuilder().insert().into(Endpoint).values({
        url,method:method as HttpEndpoint
      }).execute();
    }
    const roles=await queryRunner.manager.getRepository(Role).createQueryBuilder("role").where("role.isActive=:isActive",{isActive:true}).getMany();
    console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET);
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.log("Failed To truncate table",error)
  }finally{
    await queryRunner.release();
  }
  
  console.log(routes);
  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
  
const documentFactory = () => SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, documentFactory);
  
}
bootstrap();
