import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { ElectricMaterial } from '../../src/entities/electric-material.entity';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';
import { Supplier } from '../../src/entities/supplier.entity';

describe('ElectricMaterial Resolver', () => {
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

  it('should return all electricMaterials in the database', async () => {

    const supplier = await Supplier.create({
      name: "supplier ElectricMaterial name"
    }).save()

    const electricMaterial = await ElectricMaterial.create({
      name: "Random ElectricMaterial name",
      supplierId: supplier.id,
      quantityInStock: 200
    }).save()

    const response = await testClient.request(gql`
    query electricMaterials {
      electricMaterials{
      id
      name
      quantityInStock
      supplier {
        id
        name
      }
    }
  }`)

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(Array.isArray(response.body.data.electricMaterials)).toBe(true)
    expect(response.body.data.electricMaterials.length).toBeGreaterThan(0)
    expect(response.body.data.electricMaterials[0].id).toBe(electricMaterial.id)
    expect(response.body.data.electricMaterials[0].name).toBe(electricMaterial.name)
    expect(response.body.data.electricMaterials[0].quantityInStock).toBe(electricMaterial.quantityInStock)
    expect(response.body.data.electricMaterials[0].supplier).not.toBeNull()
    expect(response.body.data.electricMaterials[0].supplier.id).toBe(supplier.id)
    expect(response.body.data.electricMaterials[0].supplier.name).toBe(supplier.name)

  }, 100000);
});
