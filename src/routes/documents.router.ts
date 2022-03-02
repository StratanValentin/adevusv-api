import express from "express";
import { customLog } from "../utils/logging.utils";
import * as documents from "../controllers/documents.controller";

export const documentsRouter = express.Router();
documentsRouter.get("/", documents.getDocuments);
