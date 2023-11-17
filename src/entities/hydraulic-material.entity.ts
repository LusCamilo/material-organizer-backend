import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';
import { Supplier } from './supplier.entity';
import { MaterialBase } from './MaterialBase';

@Entity({ name: 'electric_materials' })
@ObjectType()
export class HydraulicMaterial extends MaterialBase {
    @Field(() => Supplier, { nullable: true })
    @ManyToOne(() => Supplier, supplier => supplier.hydraulicMaterial, {
        onDelete: "CASCADE"
    })
    supplier: Supplier
}