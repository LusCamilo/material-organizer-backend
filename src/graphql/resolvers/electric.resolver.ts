import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { ElectricMaterial } from "src/entities/electric-material.entity"
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
}