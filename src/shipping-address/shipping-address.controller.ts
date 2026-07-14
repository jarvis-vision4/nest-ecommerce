import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { AuthGuard } from 'src/cores/guards/auth.guard';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { TransformDto } from 'src/cores/interceptors/transform-dto.interceptor';
import { ResponseShippingAddressDto } from './dto/response-shipping-address.dto';

@Controller('api/v1/shipping-address')
@UseGuards(AuthGuard)
@TransformDto(ResponseShippingAddressDto)
export class ShippingAddressController {
  constructor(private readonly shippingAddressService: ShippingAddressService) { }

  @Post('add')
  create(@Body() createShippingAddressDto: CreateShippingAddressDto, @CurrentUser() user) {
    return this.shippingAddressService.create(createShippingAddressDto, user);
  }

  @Get('all')
  findAll(@CurrentUser() user) {
    return this.shippingAddressService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingAddressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingAddressDto: UpdateShippingAddressDto) {
    return this.shippingAddressService.update(+id, updateShippingAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingAddressService.remove(+id);
  }
}
