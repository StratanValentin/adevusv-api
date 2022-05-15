import express from "express";
import { authRouter } from "./auth.router";
import { documentsRouter } from "./documents.router";
import { facultiesRouter } from "./faculties.router";
import { filesRouter } from "./files.router";
import { studentsRouter } from "./students.router";
import { chartsRouter } from "./charts.router";
import { secretariesRouter } from "./secretaries.router";

export const router = express.Router();
router.use("/api/auth", authRouter);
router.use("/api/documents", documentsRouter);
router.use("/api/files", filesRouter);
router.use("/api/students", studentsRouter);
router.use("/api/faculties", facultiesRouter);
router.use("/api/charts", chartsRouter);
router.use("/api/secretaries", secretariesRouter);
