import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';
import { Supplier } from '../../src/entities/supplier.entity';

describe('Supplier Resolver', () => {

  const createSupplierMutation = gql`
  mutation createSupplier($name: String!){
    createSupplier(input: {name: $name}){
      id 
      name
    }
  }`

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

  it('should create new suppliers with success', async () => {


    const name = "teste"
    const response = await testClient.request(createSupplierMutation,
      { name }
    )

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.createSupplier).toBeDefined()
    expect(typeof response.body.data.createSupplier.id === "string").toBe(true)
    expect(response.body.data.createSupplier.name).toBe(name)
    expect(
      await Supplier.findOne({
        where: {
          id: response.body.data.createSupplier.id
        }
      })
    ).not.toBeNull()

  });

  it('should create new suppliers with error', async () => {

    const name = "teste"
    const response = await testClient.request(createSupplierMutation,
      { name }
    )

    expect(response.status).toBe(200)
    expect(response.body.data).toBeNull()
    expect(response.body.errors[0].message).toBe("SqliteError: UNIQUE constraint failed: supplier.name")

  });

  it('should validate name is at least 3 characters', async () => {

    const name = "AB"
    const badResponse = await testClient.request(createSupplierMutation,
      { name }
    )

    expect(badResponse.status).toBe(200)
    expect(badResponse.body.data).toBeNull()
    expect(badResponse.body.errors[0].extensions.originalError.message)
      .toContain("O Nome deve ter mais de 3 caracteres")

    const goodResponse = await testClient.request(createSupplierMutation,
      { name: name + "abc" }
    )

    expect(goodResponse.status).toBe(200)
    expect(goodResponse.body.data).not.toBeNull()

  });
});
