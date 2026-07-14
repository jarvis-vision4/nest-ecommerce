import { IsIn, IsNotEmpty } from 'class-validator';
import { HttpEndpoint } from '../entities/endpoint.entity';

export class CreateEndpointDto {
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  @IsIn(['GET', 'POST', 'PUT', 'DELETE'])
  method: HttpEndpoint;
}
