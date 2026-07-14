import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { User } from 'src/user/entities/user.entity';
import { AddToCartDTO } from './dto/add-to-cart.dto';
import { ProductService } from 'src/product/product.service';
import { UserPayload } from 'src';
import { VariantsService } from 'src/variants/variants.service';

export interface VariantItem {
  variantId: number;
  variantName: string;
  variantItemId: number;
  value: string;
  price: number;
}

export interface ParsedVariant {
  variants: VariantItem[];
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
    private variantService: VariantsService,
  ) {}

  async create(user: User) {
    const cart = new Cart();
    cart.user = user;
    const saved = await this.cartRepository.save(cart);
    return saved;
  }

  async findCart(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: { cartItems: { product: true } },
    });
    if (!cart) {
      throw new NotFoundException('Cart Not Found for user');
    }
    return cart;
  }

  async getOrCreateCart(currentUser: UserPayload) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: currentUser.id } },
      relations: { cartItems: { product: true } },
    });
    if (!cart) {
      const user = { id: currentUser.id } as User;
      cart = await this.create(user);
    }
    return cart;
  }

  async getCartByUser(currentUser: UserPayload) {
    const cart = await this.getOrCreateCart(currentUser);
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { id: cart.id } },
      relations: { product: true },
    });

    const itemsWithVariants = cartItems.map((item) => ({
      ...item,
      variant: (JSON.parse(item.variant) as ParsedVariant) || { variants: [] },
      product: item.product,
      totalPrice: Number(item.price) * item.quantity,
    }));

    return {
      ...cart,
      cartItems: itemsWithVariants,
      totalPrice: cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      ),
    };
  }

  async addItemToCart(addtoCartDto: AddToCartDTO, currentUser: UserPayload) {
    const { quantity, variantItemIds, productId } = addtoCartDto;

    if (!variantItemIds || variantItemIds.length === 0) {
      throw new BadRequestException('Please select all variants');
    }

    const product = await this.productService.findOne(productId);
    const variants =
      await this.variantService.findVariantsWithProductId(productId);

    const selectedIds = new Set(variantItemIds);
    const selectedVariants: {
      variantId: number;
      variantName: string;
      variantItemId: number;
      value: string;
      price: number;
    }[] = [];

    for (const variant of variants) {
      const selectedItem = variant.items.find((item) =>
        selectedIds.has(item.id),
      );

      if (!selectedItem) {
        throw new BadRequestException(
          `Please select an option for variant: ${variant.name}`,
        );
      }

      selectedVariants.push({
        variantId: variant.id,
        variantName: variant.name,
        variantItemId: selectedItem.id,
        value: selectedItem.value,
        price: Number(selectedItem.price),
      });
    }

    if (selectedVariants.length !== variants.length) {
      throw new BadRequestException('Please select all variants');
    }

    const cart = await this.getOrCreateCart(currentUser);

    const existingItems = await this.cartItemRepository.find({
      where: { cart: { id: cart.id }, product: { id: productId } },
      relations: { product: true },
    });

    let existingItem: CartItem | null = null;
    for (const item of existingItems) {
      const storedVariants = (JSON.parse(item.variant) as ParsedVariant)
        .variants;
      const isSame = this.areVariantsEqual(storedVariants, selectedVariants);
      if (isSame) {
        existingItem = item;
        break;
      }
    }

    const variantPriceSum = selectedVariants.reduce(
      (sum, v) => sum + v.price,
      0,
    );
    const itemPrice = Number(product.price) + variantPriceSum;

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = itemPrice;
      return await this.cartItemRepository.save(existingItem);
    }

    const cartItem = new CartItem();
    cartItem.quantity = quantity;
    cartItem.product = product;
    cartItem.cart = cart;
    cartItem.price = itemPrice;
    cartItem.variant = JSON.stringify({ variants: selectedVariants });

    const savedItem = await this.cartItemRepository.save(cartItem);
    await this.updateCartTotal(cart.id);
    return savedItem;
  }

  private areVariantsEqual(
    stored: { variantItemId: number }[],
    selected: { variantItemId: number }[],
  ): boolean {
    if (stored.length !== selected.length) return false;
    const storedIds = new Set(stored.map((v) => v.variantItemId));
    return selected.every((v) => storedIds.has(v.variantItemId));
  }

  async updateCartItemQuantity(
    cartItemId: number,
    quantity: number,
    currentUser: UserPayload,
  ) {
    const cart = await this.getOrCreateCart(currentUser);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cart: { id: cart.id } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (quantity <= 0) {
      await this.cartItemRepository.remove(cartItem);
    } else {
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    }

    await this.updateCartTotal(cart.id);
    return { message: 'Cart updated' };
  }

  async removeCartItem(cartItemId: number, currentUser: UserPayload) {
    const cart = await this.getOrCreateCart(currentUser);
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cart: { id: cart.id } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
    await this.updateCartTotal(cart.id);
    return { message: 'Item removed from cart' };
  }

  async clearCart(currentUser: UserPayload) {
    const cart = await this.getOrCreateCart(currentUser);
    await this.cartItemRepository.delete({ cart: { id: cart.id } });
    cart.totalPrice = 0;
    await this.cartRepository.save(cart);
    return { message: 'Cart cleared' };
  }

  private async updateCartTotal(cartId: number) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: { cartItems: true },
    });

    if (cart) {
      cart.totalPrice = cart.cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      await this.cartRepository.save(cart);
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
