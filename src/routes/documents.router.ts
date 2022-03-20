import express from "express";
import { customLog } from "../utils/logging.utils";
import * as documents from "../controllers/documents.controller";

export const documentsRouter = express.Router();
documentsRouter.get("/", documents.getDocuments);
documentsRouter.put("/", documents.updateDocument);
documentsRouter.post("/pdf", documents.generatePdfFromDocument);
documentsRouter.post("/", documents.createDocument);
documentsRouter.get("/reserved", documents.getReservedWordsByDocumentId);
documentsRouter.post("/request", documents.createDocumentRequest);
