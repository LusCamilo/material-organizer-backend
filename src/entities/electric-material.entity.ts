import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';
import { Supplier } from './supplier.entity';
import { MaterialBase } from './MaterialBase';

@Entity({ name: 'electric_materials' })
@ObjectType()
export class ElectricMaterial extends MaterialBase {
    @Field(() => Supplier, { nullable: true })
    @ManyToOne(() => Supplier, supplier => supplier.electricMaterial, {
        onDelete: "CASCADE"
    })
    supplier: Supplier
}