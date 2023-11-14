import { INestApplication } from "@nestjs/common";
import { DocumentNode } from "graphql";
import request from 'supertest';

export class TestClient {
    constructor(private app: INestApplication){}
    async request(document: DocumentNode, variables?: Record<string, any>) {
        const response = await request(this.app.getHttpServer())
            .post('/graphql')
            .send({
                query: document,
                variables
            })
            .set("Content-Type", "application/json")
            .set("Accept", "application/json")
    }

}