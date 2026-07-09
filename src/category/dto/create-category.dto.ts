import { IsNotEmpty, Length } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    name!:string;
    @IsNotEmpty()
    @Length(3)
    description!:string;

}
