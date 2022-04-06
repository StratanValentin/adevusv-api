import express from "express";
import * as filesController from "../controllers/files.controller";

export const filesRouter = express.Router();
filesRouter.post("/", filesController.parseSpreadsheet);
