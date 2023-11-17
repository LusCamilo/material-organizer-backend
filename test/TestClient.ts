import { INestApplication } from "@nestjs/common";
import { type DocumentNode, print } from "graphql";
import request from 'supertest';

export class TestClient {
    constructor(private app: INestApplication) { }
    request(document: DocumentNode, variables?: Record<string, any>) {
        return request(this.app.getHttpServer())
            .post('/graphql')
            .send({
                query: print(document),
                variables
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
    }

}