import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { ElectricMaterial } from '../../src/entities/electric-material.entity';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';
import { Supplier } from '../../src/entities/supplier.entity';

const electricMaterialQuery = gql`
  query ElectricMaterial($id: ID!){
    electricMaterial(id: $id){
      id
      name
      quantityInStock
      supplier{
        id
        name
      }
    }
  }
`

describe('Electric Material Resolver', () => {
  let app: INestApplication;
  let testClient: TestClient

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app)
    await app.init();
    testClient = new TestClient(app)
  }, 10000);

  it('should return electricMaterial by id in the database', async () => {

    const supplier = await Supplier.create({
      name: "supplier ElectricMaterial name"
    }).save()

    const electricMaterial = await ElectricMaterial.create({
      name: "Random ElectricMaterial name",
      supplierId: supplier.id,
      quantityInStock: 200
    }).save()

    const response = await testClient.request(electricMaterialQuery, {
      id: electricMaterial.id
    })

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.electricMaterial.id).toBe(electricMaterial.id)
    expect(response.body.data.electricMaterial.name).toBe(electricMaterial.name)
    expect(response.body.data.electricMaterial.quantityInStock).toBe(electricMaterial.quantityInStock)
    expect(response.body.data.electricMaterial.supplier).not.toBeNull()
    expect(response.body.data.electricMaterial.supplier.id).toBe(supplier.id)
    expect(response.body.data.electricMaterial.supplier.name).toBe(supplier.name)

  }, 100000);


  it("should return electric Material by id if it doesn't exist", async () => {

    const response = await testClient.request(electricMaterialQuery, { id: "supplier-id" })

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.electricMaterial).toBeNull()

  }, 100000);

});
