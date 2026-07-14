import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { CurrentUser } from 'src/cores/decorators/current-user.decorator';
import { UserPayload } from 'src';
import { AuthGuard } from 'src/cores/guards/auth.guard';
import { UpdateCartDTO } from './dto/update-cart.dto';

@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  @UseGuards(AuthGuard)
  async getCart(@CurrentUser() user: UserPayload) {
    return this.cartService.getCartByUser(user);
  }

  @Post('add-to-cart')
  @UseGuards(AuthGuard)
  async addItemToCart(
    @Body() addtoCartDto: AddToCartDTO,
    @CurrentUser() user: UserPayload,
  ) {
    return this.cartService.addItemToCart(addtoCartDto, user);
  }

  @Patch('item/:cartItemId')
  @UseGuards(AuthGuard)
  async updateCartItem(
    @Param('cartItemId') cartItemId: string,
    @Body() updateDto: UpdateCartDTO,
    @CurrentUser() user: UserPayload,
  ) {
    return this.cartService.updateCartItemQuantity(
      +cartItemId,
      updateDto.quantity,
      user,
    );
  }

  @Delete('item/:cartItemId')
  @UseGuards(AuthGuard)
  async removeCartItem(
    @Param('cartItemId') cartItemId: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.cartService.removeCartItem(+cartItemId, user);
  }

  @Delete('clear')
  @UseGuards(AuthGuard)
  async clearCart(@CurrentUser() user: UserPayload) {
    return this.cartService.clearCart(user);
  }
}
