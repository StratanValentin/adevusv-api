import express from "express";
import * as facultiesController from "../controllers/faculties.controller";

export const facultiesRouter = express.Router();
facultiesRouter.get("/", facultiesController.getAllFaculties);
