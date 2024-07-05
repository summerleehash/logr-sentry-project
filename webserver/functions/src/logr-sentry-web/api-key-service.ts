import { admin } from "../config";
import shortUUID from "short-uuid";
import crypto from "crypto";

const API_KEYS_COLLECTION = "api_keys";

type ApiKeyRecord = {
  uid: string; // Hash of the API key
  owner_id: string;
  name: string;
  hint: string;
  created_at_ms: number;
  created_at?: string;
};

const COLLECTION_REF = admin.firestore().collection(API_KEYS_COLLECTION);

export class ApiKeyService {
  async getApiKeys(userId: string) {
    const snapshot = await COLLECTION_REF.where("owner_id", "==", userId).get();
    return snapshot.docs.map((doc) => {
      const toReturn = doc.data() as ApiKeyRecord;
      toReturn.created_at = new Date(toReturn.created_at_ms).toLocaleString();
      return toReturn;
    });
  }

  hashApiKey(apiKey: string): string {
    const salted = 'SUPER_SECURE_SALT' + apiKey;
    return crypto.createHash("sha1").update(salted).digest("hex");
  }

  // Generate a new API key
  async generateApiKey(ownerId: string, keyName: string): Promise<string> {
    const apiKey = shortUUID.generate();
    const subset = apiKey.slice(0, 5);
    const hash = this.hashApiKey(apiKey);
    const doc = COLLECTION_REF.doc(hash);
    const payload: ApiKeyRecord = {
      uid: hash,
      owner_id: ownerId,
      name: keyName,
      hint: `${subset}********************************`,
      created_at_ms: Date.now(),
    };

    await doc.set(payload);

    return apiKey;
  }

  // Check if an API key is valid
  async isValidApiKey(apiKey: string): Promise<boolean> {
    const hash = this.hashApiKey(apiKey);
    const doc = await COLLECTION_REF.doc(hash).get();
    return doc.exists;
  }

  async getUserIdWithApiKey(apiKey: string): Promise<string | null> {
    const hash = this.hashApiKey(apiKey);
    const doc = await COLLECTION_REF.doc(hash).get();

    if (!doc.exists) {
      return null;
    }

    const record = doc.data() as ApiKeyRecord;
    return record.owner_id;
  }
}
