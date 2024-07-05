import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import mustacheExpress from "mustache-express";
import websiteRouter from "./web-router";
import apiRouter from "./api-router";

const app = express();

app.use(express.json());

// Register ".mustache" extension with Mustache-Express
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

// const BASE_URL = "http://127.0.0.1:5001/logr-sentry-312c5/us-central1/web";

// Router for the website
app.use('/', websiteRouter);

// Router for the API
app.use('/api', apiRouter);

export const server = onRequest({ cors: true }, app);

