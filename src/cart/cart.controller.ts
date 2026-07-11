import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { UserPayload } from 'src';
import { AuthGuard } from 'src/cores/guards/auth.guard';



@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }


  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
  //   return this.cartService.update(+id, updateCartDto);
  // }
  @Post('add-to-cart')
  @UseGuards(AuthGuard)
  addItemToCart(@Body() addtoCartDto: AddToCartDTO, @CurrentUser() user: UserPayload) {
    return this.cartService.addItemToCart(addtoCartDto, user)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
