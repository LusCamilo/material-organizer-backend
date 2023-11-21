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

  const deleteSupplierMutation = gql`
  mutation DeleteSupplier($id: ID!){
    DeleteSupplier(id: $id)
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

  it('should delete supplier from database', async () => {

    const supplier = await Supplier.create({
      name: "Supplier name"
    }).save()

    const response = await testClient.request(deleteSupplierMutation, {
      id: supplier.id
    })

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.DeleteSupplier).toBe(true)
    expect(await Supplier.findOne({ where: { id: supplier.id } })).toBeNull()

  }, 100000);
});
