import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, BaseEntity as typeormBaseEntity, CreateDateColumn, Column } from 'typeorm';

@InterfaceType()
export abstract class MaterialBase extends typeormBaseEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @CreateDateColumn()
    updatedAt: Date

    @Field()
    @Column('text', { unique: true })
    name: string;

    @Field(() => Int)
    @Column('integer')
    quantityInStock: number;

    @Field()
    @Column("uuid")
    supplierId: string

}
