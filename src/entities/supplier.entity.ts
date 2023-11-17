import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from "./baseEntity";
import { ElectricMaterial } from './electric-material.entity';
import { HydraulicMaterial } from './hydraulic-material.entity';
import { ChemicalMaterial } from './chemical-material.entity';

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

    @Field(() => [HydraulicMaterial], { nullable: true })
    @OneToMany(
        () => HydraulicMaterial,
        HydraulicMaterial => HydraulicMaterial.supplier,
        { onDelete: "CASCADE" }
    )
    hydraulicMaterial: HydraulicMaterial[]

    @Field(() => [ChemicalMaterial], { nullable: true })
    @OneToMany(
        () => ChemicalMaterial,
        ChemicalMaterial => ChemicalMaterial.supplier,
        { onDelete: "CASCADE" }
    )
    chemicalMaterial: ChemicalMaterial[]

}
