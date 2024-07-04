import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import mustacheExpress from "mustache-express";
import { ClusterFirestoreService } from "./Cluster";

const app = express();

app.use(express.json());

// Register ".mustache" extension with Mustache-Express
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

console.log(`__dirname: ${__dirname}/views`);

const clusterService = new ClusterFirestoreService();

// Routes
app.get("/", async (req, res) => {
  const clusters = await clusterService.getClusters();
  res.render("index", { clusters, sort: "asc" });
});

app.get("/test", async (req, res) => {
  res.json({ result: 'ok' });
});

app.post("/name", async (req, res) => {
  const { id, name } = req.body;
  const cluster = await clusterService.getCluster(id);
  if (cluster) {
    cluster.name = name;
  }
  const clusters = await clusterService.getClusters();
  res.render("index", { clusters, sort: "asc" });
});

app.post("/api/clusters", async (req, res) => {
  if (req.body) {
    console.log(`cluster: ${JSON.stringify(req.body)}`);
    const cluster = await clusterService.addCluster(req.body);
    res.status(201).json(cluster);
    return;
  }
  res.status(400).send("Cluster data is required");
});

export const server = onRequest({ cors: true }, app);
