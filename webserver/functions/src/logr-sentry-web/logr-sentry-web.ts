import express from "express";
import { onRequest } from "firebase-functions/v2/https";
import mustacheExpress from "mustache-express";
import { ClusterFirestoreService } from "./Cluster";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseClientApp } from "../config";

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

app.get("/login", async (req, res) => {
  const clusters = await clusterService.getClusters();
  res.render("login", { clusters, sort: "asc" });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string, password?: string };

    if (!email || email.trim().length === 0) {
      throw new Error("Email is required");
    }

    if (!password || password.trim().length === 0) {
      throw new Error("Password is required");
    }
    
    const auth = getAuth(await getFirebaseClientApp())
    const result = await signInWithEmailAndPassword(auth, email, password)

    if (result.user) {
      // TODO: Save session and then redirect
      // result.user.uid

      res.redirect("/");
      return;
    }

    throw new Error("Invalid email or password");    
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    res.render("login", { error: error.message });
  }
})

// TODO: POST /login
// TODO: GET /logout


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

