import { User } from "./user/entities/user.entity";

export interface UserPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
