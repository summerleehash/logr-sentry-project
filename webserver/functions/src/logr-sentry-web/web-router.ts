import * as express from 'express';
import session from "express-session";
import { FirestoreStore } from "@google-cloud/connect-firestore";
import { Firestore } from "@google-cloud/firestore";
import { ClusterFirestoreService } from './Cluster';
import { getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';
import { getFirebaseClientApp } from '../config';
import { ApiKeyService } from './api-key-service';

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

const clusterService = new ClusterFirestoreService();

const sessionMiddleware = session({
  store: new FirestoreStore({
    dataset: new Firestore(),
    kind: 'express-sessions',
  }),
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true,
});

const router = express.Router();

router.use(sessionMiddleware);

// Routes
router.get("/", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  const clusters = await clusterService.getClusters();
  res.render("index", { clusters, sort: "asc" });
});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => null);
  res.render("logout");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string, password?: string };

    if (!email || email.trim().length === 0) {
      throw new Error("Email is required");
    }

    if (!password || password.trim().length === 0) {
      throw new Error("Password is required");
    }

    const auth = getAuth(await getFirebaseClientApp());
    const result = await signInWithEmailAndPassword(auth, email, password);

    if (result.user) {
      req.session.user = result.user;

      res.redirect("/");
      return;
    }

    throw new Error("Invalid email or password");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      res.render("login", { error: error.message });
    }
  }
});

router.get("/api-keys", async (req, res) => {
  res.render("api-keys");
});

router.post("/api-keys", async (req, res) => {
  try {
    const userId = req.session.user?.uid;
    const apiKeyName = req.body.key_name;

    if (!userId) {
      throw new Error("User not found");
    }

    if (!apiKeyName) {
      throw new Error("API Key name is required");
    }

    const service = new ApiKeyService();
    const apiKey = await service.generateApiKey(userId, apiKeyName);
    res.render("api-keys", { api_key: apiKey });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      res.render("api-keys", { error: error.message });
    }
  }
});

export default router;
