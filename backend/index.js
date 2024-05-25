import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
import cors from 'cors';
import pkg from 'ruru/server';
import db from './_db.js';

const { ruru } = pkg;

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
`);

const ROOT = {
    projects: () => {
        return db.projects.map(project => ({
            ...project,
            developer: db.developers.find((dev) => dev.id == project.developerId)
        }));
    },
    developers: () => {
        return db.developers;
    },
    project: (args) => {
       const project = db.projects.find(p => p.id == args.id);
       return { ... project, developer: db.developers.find((dev) => dev.id == project.developerId)}
    }
};

const app = express();

// Enable CORS for all routes
app.use(cors());

// GraphQL endpoint
app.all("/graphql", createHandler({
    schema: SCHEMA,
    rootValue: ROOT,
}));

// Serve the ruru GraphQL editor
app.get("/", (req, res) => {
    res.type("html");
    res.end(ruru({ endpoint: "/graphql" }));
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
    console.log(`ruru GraphQL editor available at http://localhost:${PORT}/`);
});
