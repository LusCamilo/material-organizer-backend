import { Field, InterfaceType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, BaseEntity as typeormBaseEntity, CreateDateColumn } from 'typeorm';

@InterfaceType()
export abstract class BaseEntity extends typeormBaseEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @CreateDateColumn()
    updatedAt: Date
}