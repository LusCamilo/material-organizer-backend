import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import gql from 'graphql-tag';
import { TestClient } from '../TestClient';
import { applyAppMiddleware } from '../../src/utils/apply-app-middleware';
import { ElectricMaterial } from '../../src/entities/electric-material.entity';

describe('ElectricMaterial Resolver', () => {

  const createElectricMaterialMutation = gql`
  mutation createElectricMaterial($name: String!){
    createElectricMaterial(input: {name: $name}){
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

  it('should create new electricMaterials with success', async () => {


    const name = "teste"
    const response = await testClient.request(createElectricMaterialMutation,
      { name }
    )

    expect(response.status).toBe(200)
    expect(response.body.data).not.toBeNull()
    expect(response.body.data.createElectricMaterial).toBeDefined()
    expect(typeof response.body.data.createElectricMaterial.id === "string").toBe(true)
    expect(response.body.data.createElectricMaterial.name).toBe(name)
    expect(
      await ElectricMaterial.findOne({
        where: {
          id: response.body.data.createElectricMaterial.id
        }
      })
    ).not.toBeNull()

  });

  it('should create new electricMaterials with error', async () => {

    const name = "teste"
    const response = await testClient.request(createElectricMaterialMutation,
      { name }
    )

    expect(response.status).toBe(200)
    expect(response.body.data).toBeNull()
    expect(response.body.errors[0].message).toBe("SqliteError: UNIQUE constraint failed: electric-material.entity.name")

  });

  it('should validate name is at least 3 characters', async () => {

    const name = "AB"
    const badResponse = await testClient.request(createElectricMaterialMutation,
      { name }
    )

    expect(badResponse.status).toBe(200)
    expect(badResponse.body.data).toBeNull()
    expect(badResponse.body.errors[0].extensions.originalError.message)
      .toContain("O Nome deve ter mais de 3 caracteres")

    const goodResponse = await testClient.request(createElectricMaterialMutation,
      { name: name + "abc" }
    )

    expect(goodResponse.status).toBe(200)
    expect(goodResponse.body.data).not.toBeNull()

  });
});
