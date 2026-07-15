import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateShippingRuleDto } from './dto/create-shipping-rule.dto';
import { UpdateShippingRuleDto } from './dto/update-shipping-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingRule } from './entities/shipping-rule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingRuleService {

  constructor(
    @InjectRepository(ShippingRule)
    private shippingRuleRepository: Repository<ShippingRule>
  ) {

  }
  create(createShippingRuleDto: CreateShippingRuleDto) {
    const shippingRule = new ShippingRule()
    const savedRule = Object.assign(shippingRule, createShippingRuleDto)
    return this.shippingRuleRepository.save(savedRule);
  }

  async findAll() {
    const shippingRules = await this.shippingRuleRepository.find({
      where: {
        status: true
      }
    })
    if (shippingRules.length == 0) {
      throw new NotFoundException("Shipping Rules Not Found")
    }
    return shippingRules;
  }

  async findOne(id: number) {
    const shippingRule = await this.shippingRuleRepository.findOne({
      where: {
        id,
      }
    })
    if (!shippingRule) {
      throw new NotFoundException("Shipping Rule Not Found")
    }
    return shippingRule;
  }

  async update(id: number, updateShippingRuleDto: UpdateShippingRuleDto) {
    const shippingRule = await this.findOne(id)
    const updateShippingRule = Object.assign(shippingRule, updateShippingRuleDto)
    return await this.shippingRuleRepository.save(updateShippingRule)
  }

  async remove(id: number) {
    const shippingRule = await this.findOne(id)
    await this.shippingRuleRepository.remove(shippingRule)
  }
}
