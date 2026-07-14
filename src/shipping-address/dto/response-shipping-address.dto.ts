import { Expose, Transform } from "class-transformer";
import { UserPayload } from "src";
import { User } from "src/user/entities/user.entity";
import { ShippingAddress } from "../entities/shipping-address.entity";

export class ResponseShippingAddressDto {
    @Expose()
    id!: number;
    @Expose()
    value!: string;
    @Expose()
    phoneNumber!: number;
    @Expose()
    userId!: number;
    @Expose()
    username!: User;
}