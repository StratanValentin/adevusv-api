import express from "express";
import { authRouter } from "./auth.router";
import { documentsRouter } from "./documents.router";
import { filesRouter } from "./files.router";
import { studentsRouter } from "./students.router";

export const router = express.Router();
router.use("/api/auth", authRouter);
router.use("/api/documents", documentsRouter);
router.use("/api/files", filesRouter);
router.use("/api/students", studentsRouter);
