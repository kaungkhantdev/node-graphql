import { buildSchema } from 'graphql';

const SCHEMA = buildSchema(`
    type Project {
        id: ID!,
        name: String!,
        content: String!,
        developer: Developer!
    }
    type Developer {
        id: ID!,
        name: String!
    }
    type Query {
        projects: [Project!]!
        developers: [Developer!]!
        project(id: ID!): Project
    }
    type Mutation {
        addDeveloper(input: AddDev!): Developer
        updateDeveloper(id: ID!, edit: EditDev ): Developer
    }

    input AddDev {
        id: ID!
        name: String!
    }

    input EditDev { 
        name: String!
    }
`);

export default SCHEMA