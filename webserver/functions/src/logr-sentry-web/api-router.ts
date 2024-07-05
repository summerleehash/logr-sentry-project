import * as express from 'express';
import { ClusterFirestoreService } from './Cluster';
import { middlewareApiKey } from './middlewareApiKey';

const clusterService = new ClusterFirestoreService();
const router = express.Router();

router.post("/clusters", middlewareApiKey, async (req, res) => {
  if (req.body) {
    console.log(`cluster: ${JSON.stringify(req.body)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ownerId = (req as any).userId;
    const cluster = await clusterService.addCluster(req.body, ownerId);
    res.status(201).json(cluster);
    return;
  }
  res.status(400).send("Cluster data is required");
});

export default router;
