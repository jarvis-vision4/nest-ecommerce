import { Expose } from "class-transformer";
import { SHIPPING_RULE_TYPES } from "../entities/shipping-rule.entity";

export class ResponseShippingRuleDto {
    @Expose()
    id!: number;
    @Expose()
    type!: SHIPPING_RULE_TYPES;
    @Expose()
    cost!: number;
    @Expose()
    estimateDay!: number;

}