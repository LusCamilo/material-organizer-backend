import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import gql from 'graphql-tag';
import { print } from 'graphql';
import { Supplier } from '../src/entities/supplier.entity';

describe('Supplier Resolver', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return all suppliers in the database', async () => {

    const supplier = await Supplier.create({
      name: "Random Supplier name"
    }).save()

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: print(gql`
          query suppliers {
            suppliers{
            name
            electricMaterial{
              id
              name
            }
          }
        }`)
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(Array.isArray(response.body.data.suppliers)).toBe(true)
    expect(response.body.data.suppliers.length).toBeGreaterThan(0)
    expect(response.body.data.suppliers[0].id).toBe(supplier.id)
    expect(response.body.data.suppliers[0].name).toBe(supplier.name)
    expect(response.body.data.suppliers[0].electricMaterial).not.toBeNull()

  }, 100000);

  it('should create new suppliers', async () => {

    const name = "teste"

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: print(gql`
          mutation createSupplier($name: string!){
            createSupplier(input: {name: $name}){
              id 
              name
            }
        }`),
        variables: {
          name,
        }
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.createSupplier).toBeDefined()
    expect(typeof response.body.data.createSupplier.id === "string").toBe(true)
    expect(response.body.data.createSupplier.name).toBe(name)

  });
});
