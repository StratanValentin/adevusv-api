import express from "express";
import * as secretariesController from "../controllers/secretaries.controller";

export const secretariesRouter = express.Router();
secretariesRouter.get("/", secretariesController.getAllSecretaries);
secretariesRouter.get("/secretary", secretariesController.getSecretaryById);
secretariesRouter.delete(
  "/secretary",
  secretariesController.deleteSecretaryById
);
secretariesRouter.post("/secretary", secretariesController.createSecretary);
secretariesRouter.put("/secretary", secretariesController.updateSecretary);
