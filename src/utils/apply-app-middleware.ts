import { INestApplication, ValidationPipe } from "@nestjs/common";

export function applyAppMiddleware(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe());
}