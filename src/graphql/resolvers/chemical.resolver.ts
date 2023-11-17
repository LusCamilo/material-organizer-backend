import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql"
import { ChemicalMaterial } from "../../entities/chemical-material.entity"
import { CreateChemicalMaterialInput } from "../inputs/create-chemical-material.input"

@Resolver(() => ChemicalMaterial)
export class ChemicalMaterialResolver {
    @Query(() => [ChemicalMaterial])
    async chemicalMaterials() {
        return ChemicalMaterial.find({
            relations: {
                supplier: true
            }
        })
    }

    @Query(() => ChemicalMaterial, { nullable: true })
    async chemicalMaterial(
        @Args("id", { type: () => ID })
        id: string
    ) {
        return ChemicalMaterial.findOne({
            where: { id },
            relations: {
                supplier: true
            }
        })
    }

    @Mutation(() => ChemicalMaterial)
    async createChemicalMaterial(
        @Args('input', { type: () => CreateChemicalMaterialInput })
        input: CreateChemicalMaterialInput
    ) {
        return ChemicalMaterial.create({
            name: input.name,
            supplierId: input.supplierId,
            quantityInStock: input.quantityInStock
        }).save()
    }

    @Mutation(() => ChemicalMaterial, { nullable: true })
    async updateChemicalMaterial(
        @Args('id', { type: () => ID })
        id: string,
        @Args('input', { type: () => CreateChemicalMaterialInput })
        input: CreateChemicalMaterialInput
    ) {
        const chemicalMaterial = await ChemicalMaterial.findOne({
            where: { id }
        })

        if (!chemicalMaterial) {
            return null
        }

        chemicalMaterial.name = input.name
        chemicalMaterial.quantityInStock = input.quantityInStock

        Object.assign(chemicalMaterial, input)

        return chemicalMaterial.save()
    }

    @Mutation(() => Boolean)
    async deleteChemicalMaterial(
        @Args("id", { type: () => ID })
        id: string
    ) {
        try {
            await ChemicalMaterial.delete(id)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

}