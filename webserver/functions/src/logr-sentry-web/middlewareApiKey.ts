import express from "express";
import { ApiKeyService } from "./api-key-service";

export const middlewareApiKey = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const bearer = req.headers["authorization"]; // returns "Bearer APIKEYKJBAKJCJAKS"
  const apiKey = bearer?.split(" ")?.[1];

  if (!apiKey) {
    next(new Error("API key is required"));
    return;
  }

  const apiKeyService = new ApiKeyService();

  if (await apiKeyService.isValidApiKey(apiKey)) {
    next();
    return;
  }

  next(new Error("Invalid API key"));
};
