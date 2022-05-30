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
documentsRouter.get(
  "/inProgress",
  documents.getAllDocumentsInprocessingByStudentId
);
documentsRouter.get(
  "/approval",
  documents.getAllDocumentsInprocessingByFacultyId
);
documentsRouter.get(
  "/reserved/process",
  documents.getReservedWordsByInProcessDocumentId
);
documentsRouter.post("/approve", documents.approveInProcessingDocument);
documentsRouter.post("/reject", documents.rejectInProcessingDocument);
documentsRouter.get(
  "/processed",
  documents.getAllDocumentsProcessedByStudentId
);
documentsRouter.get("/data", documents.getDocumentData);
documentsRouter.delete("/", documents.deleteDocumentById);
