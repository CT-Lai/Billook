import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import { print, buildSchema } from 'graphql';
import dotenv from 'dotenv';
import graphqlTypedef from './graphql/schema/index.js';
import graphqlResolvers from './graphql/resolvers/index.js';
import enableCors from './middleware/enable-cors.js';
import isAuth from './middleware/is-auth.js';

dotenv.config();

// Create an express app
const app = express();
const port = process.env.PORT || 5000;


// Create graphql schema
const graphqlSchema = buildSchema(print(graphqlTypedef));
console.log(print(graphqlTypedef));

app.use(enableCors);
app.use(isAuth);
app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true, // Enable GraphiQL when accessed via browser
    }));
const MONGO_URI=`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port localhost:${port}`);
            console.log(`Visit http://localhost:${port}/graphql to interact with the GraphQL API.`);
        });
    })
    .catch(err => {
        console.log(err);
    });