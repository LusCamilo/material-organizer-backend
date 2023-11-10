import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'node:path';
import { ElectricMaterialResolver } from './graphql/resolvers/electric.resolver';
import { SupplierResolver } from './graphql/resolvers/supplier.resolver';

@Module({
  imports: [
    SupplierResolver,
    ElectricMaterialResolver,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      sortSchema: true,
      playground: true,
      driver: ApolloDriver,
      autoSchemaFile: path.join(__dirname, 'src', 'schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: path.join(__dirname, '..', 'database.sqlite'),
      entities: [path.join(__dirname, "entities", "*.entity{.ts,.js}")],
      synchronize: true,
      logging: true
    }),
  ],
})
export class AppModule { }
