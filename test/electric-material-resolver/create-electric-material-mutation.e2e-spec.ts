import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';
import { Supplier } from '../../src/entities/supplier.entity';
import { ElectricMaterial } from '../../src/entities/electric-material.entity';

describe('Electric Material Resolver', () => {

  const createElectricMaterialMutation = gql`
  mutation createElectricMaterial($input: CreateElectricMaterialInput!){
    createElectricMaterial(input: $input){
      id 
      name
      supplierId
      quantityInStock
    }
  }`

  let app: INestApplication;
  let testClient: TestClient
  let supplier: Supplier

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app)
    await app.init();
    testClient = new TestClient(app)
    supplier = await Supplier.create({
      name: "Test electric Material"
    }).save()

  });

  it('should create new electric material with success', async () => {


    const name = "teste"
    const response = await testClient.request(createElectricMaterialMutation,
      {
        input: {
          name,
          quantityInStock: 100,
          supplierId: supplier.id
        }
      }
    )

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.createElectricMaterial).toBeDefined()
    expect(typeof response.body.data.createElectricMaterial.id === "string").toBe(true)
    expect(response.body.data.createElectricMaterial.name).toBe(name)
    expect(response.body.data.createElectricMaterial.quantityInStock).toBe(100)
    expect(response.body.data.createElectricMaterial.supplierId).toBe(supplier.id)
    expect(
      await ElectricMaterial.findOne({
        where: {
          id: response.body.data.createElectricMaterial.id
        }
      })
    ).not.toBeNull()

  });

  // it('should create new suppliers with error', async () => {

  //   const name = "Test electric Material"
  //   const response = await testClient.request(createElectricMaterialMutation,
  //     { 
  //       input: {
  //         name,


  //       }
  //     }
  //   )

  //   expect(response.status).toBe(200)
  //   expect(response.body.data).toBeNull()
  //   expect(response.body.errors[0].message).toBe("SqliteError: UNIQUE constraint failed: supplier.name")

  // });

  it('should validate if quanity In Stock is negative', async () => {

    const name = "Teste"
    const badResponse = await testClient.request(createElectricMaterialMutation,
      {
        input: {
          name,
          quantityInStock: -1,
          supplierId: supplier.id
        }
      }
    )

    expect(badResponse.status).toBe(200)
    expect(badResponse.body.data).toBeNull()
    expect(badResponse.body.errors[0].extensions.originalError.message)
      .toContain("A quantidade de materias não deve ser negativo")

  });
  it('should validate name is at least 3 characters', async () => {

    const name = "AB"
    const badResponse = await testClient.request(createElectricMaterialMutation,
      {
        input: {
          name,
          quantityInStock: 100,
          supplierId: supplier.id
        }
      }
    )

    expect(badResponse.status).toBe(200)
    expect(badResponse.body.data).toBeNull()
    expect(badResponse.body.errors[0].extensions.originalError.message)
      .toContain("O Nome deve ter mais de 3 caracteres")

    const goodResponse = await testClient.request(createElectricMaterialMutation,
      {
        name: name + "abc",
        quantityInStock: 100,
        supplierId: supplier.id
      }
    )

    expect(goodResponse.status).toBe(200)
    expect(goodResponse.body.data).not.toBeNull()

  });
});
