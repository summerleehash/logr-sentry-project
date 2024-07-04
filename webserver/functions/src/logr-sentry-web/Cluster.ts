import {admin} from "../config";

export type Cluster = { id: string; name: string; time: string; mac_list: string[] };

const COLLECTION_NAME = "clusters";

/**
 * A service class for interacting with Firestore collection of clusters.
 */
export class ClusterFirestoreService {
  /**
   * Retrieves a cluster document from Firestore by its ID.
   *
   * @param {string} id - The ID of the cluster document to retrieve.
   * @returns {Promise<Cluster | null>} A Promise that resolves to the cluster document if found, or null if not found.
   */

  async getCluster(id: string): Promise<Cluster | null> {
    const snap = await admin.firestore().collection(COLLECTION_NAME).doc(id).get();
    return snap.data() as Cluster ?? null;
  }

  async getClusters(): Promise<Cluster[]> {
    const snapshot = await admin.firestore().collection(COLLECTION_NAME).orderBy("time", "desc").limit(500).get();
    return snapshot.docs.map((it) => it.data() as Cluster);
  }

  async addCluster(cluster: Partial<Cluster>): Promise<Cluster> {
    const ref = admin.firestore().collection(COLLECTION_NAME).doc();
    const payload: Cluster = {
      ...cluster,
      name: "",
      id: ref.id,
    } as Cluster;

    await ref.set(payload, {merge: true});

    return payload;
  }

  async updateCluster(id: string, payload: Partial<Cluster>) {
    const ref = admin.firestore().collection(COLLECTION_NAME).doc(id);
    await ref.set(payload, {merge: true});
  }

  async deleteCluster(id: string) {
    const ref = admin.firestore().collection(COLLECTION_NAME).doc(id);
    await ref.delete();
  }
}
