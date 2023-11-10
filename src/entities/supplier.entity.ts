import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from "./baseEntity";
import { ElectricMaterial } from './electric-material.entity';

@Entity({ name: 'supplier' })
@ObjectType()
export class Supplier extends BaseEntity {
    @Field()
    @Column('text', { unique: true })
    name: string;

    @Field(() => [ElectricMaterial], { nullable: true })
    @OneToMany(
        () => ElectricMaterial,
        electricMaterial => electricMaterial.supplier,
        { onDelete: "CASCADE" }
    )
    electricMaterial: ElectricMaterial[]
}
