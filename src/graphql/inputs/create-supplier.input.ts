import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateSupplierInput {
    @Field()
    @MinLength(3, { message: "O Nome deve ter mais de 3 caracteres" })
    name: string;
}