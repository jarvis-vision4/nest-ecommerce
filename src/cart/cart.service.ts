import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { User } from 'src/user/entities/user.entity';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { ProductService } from 'src/product/product.service';
import { UserPayload } from 'src';

import { VariantsService } from 'src/variants/variants.service';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
    private variantService: VariantsService,
  ) {


  }
  async create(user: User) {
    const cart = new Cart()
    cart.user = user
    const saved = await this.cartRepository.save(cart)
    return saved
  }
  async findCart(id: number) {
    const cart = await this.cartRepository.findOne({
      where: {
        user: {
          id
        }
      }
    })
    if (!cart) {
      throw new NotFoundException("Cart Not Found for user")
    }
    return cart;
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  // update(id: number, updateCartDto: UpdateCartDto) {
  //   return `This action updates a #${id} cart`;
  // }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  async addItemToCart(addtoCartDto: AddToCartDTO, currentUser: UserPayload) {
    const { quantity, variantItemIds, productId } = addtoCartDto;
    const product = await this.productService.findOne(productId)
    const variants = await this.variantService.findVariantsWithProductId(productId)
    const selectedIds = new Set(variantItemIds);
    const selectedVariants: {
      variantId: number;
      variantName: string;
      variantItemId: number;
      value: string;
      price: number;
    }[] = [];
    for (const variant of variants) {
      const selectedItem = variant.items.find(item =>
        selectedIds.has(item.id),
      );

      if (!selectedItem) {
        continue;
      }
      selectedVariants.push({
        variantId: variant.id,
        variantName: variant.name,
        variantItemId: selectedItem.id,
        value: selectedItem.value,
        price: Number(selectedItem.price),
      });
      if (selectedVariants.length == 0) {
        throw new BadRequestException("Please select all variants.");
      }
    }
    const cartItem = new CartItem()
    cartItem.quantity = quantity
    cartItem.product = product
    cartItem.cart = await this.findCart(currentUser.id)
    cartItem.variant = JSON.stringify({
      variants: selectedVariants,
    });
    return await this.cartItemRepository.save(cartItem)
  }
}
