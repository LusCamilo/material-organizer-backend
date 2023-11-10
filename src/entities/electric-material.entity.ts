import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from "./baseEntity";
import { Supplier } from './supplier.entity';

@Entity({ name: 'electric_materials' })
@ObjectType()
export class ElectricMaterial extends BaseEntity {
    @Field()
    @Column('text', { unique: true })
    name: string;

    @Field(() => Int)
    @Column('integer')
    quantityInStock: number;

    @Field()
    @Column("uuid")
    supplierId: string

    @Field(() => Supplier, { nullable: true })
    @ManyToOne(() => Supplier, supplier => supplier.electricMaterial, {
        onDelete: "CASCADE"
    })
    supplier: Supplier
}