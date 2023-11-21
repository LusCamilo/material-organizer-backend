import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';
import { Supplier } from '../../src/entities/supplier.entity';

describe('Supplier Resolver', () => {

  const updateSupplierMutation = gql`
  mutation UpdateSupplier($id: ID! $name: String!){
    updateSupplier(id: $id, input: {name: $name}){
      id 
      name
    }
  }`

  const name = "first Name"
  const updateName = "update Name"

  let app: INestApplication;
  let supplier: Supplier
  let testClient: TestClient

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppMiddleware(app)
    await app.init();
    testClient = new TestClient(app)
    supplier = await Supplier.create({ name: name }).save()
  }, 10000);

  it('should update new suppliers with success', async () => {

    const response = await testClient.request(updateSupplierMutation,
      {
        id: supplier.id,
        name: updateName
      }
    )

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.updateSupplier.id).toBe(supplier.id)
    expect(response.body.data.updateSupplier.name).toBe(updateName)

  });

  it('should update new suppliers with error', async () => {

    const otherSupplier = await Supplier.create({ name }).save()
    const response = await testClient.request(updateSupplierMutation,
      {
        id: otherSupplier.id,
        name: updateName
      }
    )

    expect(response.status).toBe(200)
    expect(response.body.data).toBeNull()
    expect(response.body.errors[0].message).toBe("SqliteError: UNIQUE constraint failed: supplier.name")

  });

  it('should validate name is at least 3 characters', async () => {

    const name = "AB"
    const badResponse = await testClient.request(updateSupplierMutation,
      {
        id: supplier.id,
        name
      }
    )

    expect(badResponse.status).toBe(200)
    expect(badResponse.body.data).toBeNull()
    expect(badResponse.body.errors[0].extensions.originalError.message)
      .toContain("O Nome deve ter mais de 3 caracteres")

    const goodResponse = await testClient.request(updateSupplierMutation,
      {
        id: supplier.id,
        name: updateName
      }
    )

    expect(goodResponse.status).toBe(200)
    expect(goodResponse.body.data.updateSupplier).not.toBeNull()
    expect(goodResponse.body.data.updateSupplier).toBeDefined()
    expect(goodResponse.body.data.updateSupplier.id).toBe(supplier.id)

  });
});
