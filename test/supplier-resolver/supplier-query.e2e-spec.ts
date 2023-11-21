import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { Supplier } from '../../src/entities/supplier.entity';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';

describe('Supplier Resolver query by id', () => {
  let app: INestApplication;
  let testClient: TestClient

  const supplierQuery = gql`
  query Supplier($id: ID!){
    supplier(id: $id){
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
}`

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app)
    await app.init();
    testClient = new TestClient(app)
  }, 10000);

  it('should return suppliers by id', async () => {

    const supplier = await Supplier.create({
      name: "Supplier name"
    }).save()

    const response = await testClient.request(supplierQuery, { id: supplier.id })

    console.log(JSON.stringify(supplier), null, 2)

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.supplier.id).toBe(supplier.id)
    expect(response.body.data.supplier.name).toBe(supplier.name)
    expect(response.body.data.supplier.electricMaterial).not.toBeNull()
    expect(response.body.data.supplier.hydraulicMaterial).not.toBeNull()
    expect(response.body.data.supplier.chemicalMaterial).not.toBeNull()

  }, 100000);

  it("should return suppliers by id if it doesn't exist", async () => {

    const response = await testClient.request(supplierQuery, { id: "supplier-id" })

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.supplier).toBeNull()


  }, 100000);
});
