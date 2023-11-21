import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { Supplier } from '../../src/entities/supplier.entity';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';

describe('Supplier Resolver', () => {
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
  });

  it('should return all suppliers in the database', async () => {

    const supplier = await Supplier.create({
      name: "Random Supplier name"
    }).save()

    const response = await testClient.request(gql`
    query suppliers {
      suppliers{
      id
      name
      electricMaterial{
        id
        name
        quantityInStock
      }
      chemicalMaterial{
        id
        name
        quantityInStock
      }
      hydraulicMaterial{
        id
        name
        quantityInStock
      }
    }
  }`)

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(Array.isArray(response.body.data.suppliers)).toBe(true)
    expect(response.body.data.suppliers.length).toBeGreaterThan(0)
    expect(response.body.data.suppliers[0].id).toBe(supplier.id)
    expect(response.body.data.suppliers[0].name).toBe(supplier.name)
    expect(response.body.data.suppliers[0].electricMaterial).not.toBeNull()
    expect(response.body.data.suppliers[0].hydraulicMaterial).not.toBeNull()
    expect(response.body.data.suppliers[0].chemicalMaterial).not.toBeNull()

  }, 100000);
});
