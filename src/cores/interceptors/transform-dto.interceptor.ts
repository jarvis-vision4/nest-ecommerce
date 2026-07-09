/*
https://docs.nestjs.com/interceptors#interceptors
*/

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UseInterceptors } from '@nestjs/common';

@Injectable()
export class TransformDtoInterceptor<T> implements NestInterceptor {
  constructor(private readonly dtoClass: ClassConstructor<T>) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((data) => {
          return {
           message:"success",
           data: plainToInstance(this.dtoClass, data, {
              excludeExtraneousValues: true,
            })
          }
        }),
        
      );
  }
}
export function TransformDto<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new TransformDtoInterceptor(dto));
}
