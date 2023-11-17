import { InputType, Field } from '@nestjs/graphql';
import { IsUUID, Min, MinLength } from 'class-validator';

@InputType()
export class UpdateChemicalMaterialInput {
    @Field()
    @MinLength(3, { message: "O Nome deve ter mais de 3 caracteres" })
    name: string;

    @Field()
    @Min(0, { message: "A quantidade de materias não deve ser negativo" })
    quantityInStock: number;

    @Field()
    @IsUUID("4")
    supplierId: string
}