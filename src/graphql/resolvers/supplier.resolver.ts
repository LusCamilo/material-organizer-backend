import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"
import { Supplier } from "../../entities/supplier.entity"
import { CreateSupplierInput } from "../inputs/create-supplier.input"
import { UpdateSupplierInput } from "../inputs/update-supplier.input"

@Resolver(() => Supplier)
export class SupplierResolver {
    @Query(() => [Supplier])
    async suppliers() {
        return Supplier.find({
            relations: {
                electricMaterial: true,
                hydraulicMaterial: true,
                chemicalMaterial: true
            }
        })
    }

    @Query(() => Supplier, { nullable: true })
    async supplier(@Args("id", { type: () => ID })
    id: string
    ) {
        return Supplier.findOne({
            where: { id },
            relations: {
                electricMaterial: true,
                hydraulicMaterial: true,
                chemicalMaterial: true
            }
        })
    }

    @Mutation(() => Supplier)
    async createSupplier(
        @Args('input', { type: () => CreateSupplierInput })
        input: CreateSupplierInput
    ) {
        return Supplier.create({
            name: input.name,
        }).save()
    }

    @Mutation(() => Supplier)
    async updateSupplier(
        @Args("id", { type: () => ID })
        id: string,
        @Args('input', { type: () => UpdateSupplierInput })
        input: UpdateSupplierInput
    ) {
        const supplier = await Supplier.findOne({
            where: { id },
        })

        if (!supplier) return null

        supplier.name = input.name
        return supplier.save()
    }

    @Mutation(() => Boolean)
    async DeleteSupplier(@Args("id", { type: () => ID }) id: string) {
        try {
            await Supplier.delete(id)
            return true
        } catch (error) {
            console.log(error)
        }
    }
}