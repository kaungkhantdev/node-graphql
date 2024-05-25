import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import cors from 'cors';
import { ruruHTML } from 'ruru/server';
import db from './_db.js';
import SCHEMA from './schema/index.js';


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
       return { ...project, developer: db.developers.find((dev) => dev.id == project.developerId)};
    },
    addDeveloper: ({ input }) => {
        db.developers.push(input);
        return input;
    },
    updateDeveloper: ({ id, edit}) => {
        const developer = db.developers.find(d => d.id == id);
        if (edit.name) developer.name = edit.name;
        return developer;
    }
};

const app = express();

app.use(cors());

app.all("/graphql", createHandler({
    schema: SCHEMA,
    rootValue: ROOT,
}));

app.get("/", (req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
    console.log(`ruru GraphQL editor available at http://localhost:${PORT}/`);
});
