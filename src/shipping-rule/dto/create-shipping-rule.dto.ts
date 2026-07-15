import { IsIn, IsInt, IsNotEmpty } from "class-validator";
import { SHIPPING_RULE_TYPES } from "../entities/shipping-rule.entity";

export class CreateShippingRuleDto {
    @IsNotEmpty()
    @IsIn(['very fast', 'fast', 'normal'])
    type!: SHIPPING_RULE_TYPES;
    @IsNotEmpty()
    @IsInt()
    cost!: number;
    @IsNotEmpty()
    @IsInt()
    estimateDay!: number;
}
