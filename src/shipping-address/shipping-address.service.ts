import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ShippingAddressService {

  constructor(
    @InjectRepository(ShippingAddress)
    private shippingAddressRepository: Repository<ShippingAddress>
  ) {

  }
  async create(createShippingAddressDto: CreateShippingAddressDto, user: User) {

    const shippingAddress = new ShippingAddress()
    shippingAddress.user = user
    const savedAddress = Object.assign(shippingAddress, createShippingAddressDto)

    const result = await this.shippingAddressRepository.save(savedAddress)
    return result;
  }

  async findAll(data: any) {
    const { iat, exp, ...user } = data;

    const currentUser: User = user;

    const addresses = await this.shippingAddressRepository.find({
      where: {
        user: currentUser
      },
      relations: {
        user: true
      }
    })
    if (addresses.length == 0) {
      throw new NotFoundException("Shipping Addresses Not Found")
    }
    return addresses;
  }

  async findOne(id: number) {
    const address = await this.shippingAddressRepository.findOne({
      where: {
        id
      }
    })
    if (!address) {
      throw new NotFoundException("Shipping Address Not Found")
    }
    return address;
  }

  async update(id: number, updateShippingAddressDto: UpdateShippingAddressDto) {
    const updateaddress = await this.findOne(id)
    Object.assign(updateaddress, updateShippingAddressDto)
    return await this.shippingAddressRepository.save(updateaddress)
  }

  async remove(id: number) {
    const address = await this.findOne(id)
    await this.shippingAddressRepository.remove(address)
  }
}
