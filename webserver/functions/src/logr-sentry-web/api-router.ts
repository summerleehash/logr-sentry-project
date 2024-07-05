import * as express from 'express';
import { ClusterFirestoreService } from './Cluster';
import { middlewareApiKey } from './middlewareApiKey';

const clusterService = new ClusterFirestoreService();
const router = express.Router();

router.post("/clusters", middlewareApiKey, async (req, res) => {
  if (req.body) {
    console.log(`cluster: ${JSON.stringify(req.body)}`);
    const cluster = await clusterService.addCluster(req.body);
    res.status(201).json(cluster);
    return;
  }
  res.status(400).send("Cluster data is required");
});

export default router;
