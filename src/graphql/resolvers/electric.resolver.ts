import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"
import { ElectricMaterial } from "../../entities/electric-material.entity"
import { CreateElectricMaterialInput } from "../inputs/create-electric-material.input"

@Resolver(() => ElectricMaterial)
export class ElectricMaterialResolver {
    @Query(() => [ElectricMaterial])
    async electricMaterials() {
        return ElectricMaterial.find({
            relations: {
                supplier: true
            }
        })
    }

    @Query(() => ElectricMaterial, { nullable: true })
    async electricMaterial(
        @Args("id", { type: () => ID })
        id: string
    ) {
        return ElectricMaterial.findOne({
            where: { id },
            relations: {
                supplier: true
            }
        })
    }

    @Mutation(() => ElectricMaterial)
    async createElectricMaterial(
        @Args('input', { type: () => CreateElectricMaterialInput })
        input: CreateElectricMaterialInput
    ) {
        return ElectricMaterial.create({
            name: input.name,
            supplierId: input.supplierId,
            quantityInStock: input.quantityInStock
        }).save()
    }

    @Mutation(() => ElectricMaterial, { nullable: true })
    async updateElectricMaterial(
        @Args('id', { type: () => ID })
        id: string,
        @Args('input', { type: () => CreateElectricMaterialInput })
        input: CreateElectricMaterialInput
    ) {
        const electricMaterial = await ElectricMaterial.findOne({
            where: { id }
        })

        if (!electricMaterial) {
            return null
        }

        electricMaterial.name = input.name
        electricMaterial.quantityInStock = input.quantityInStock

        Object.assign(electricMaterial, input)

        return electricMaterial.save()
    }

    @Mutation(() => Boolean)
    async deleteElectricMaterial(
        @Args("id", { type: () => ID })
        id: string
    ) {
        try {
            await ElectricMaterial.delete(id)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

}