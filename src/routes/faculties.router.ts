import express from "express";
import * as facultiesController from "../controllers/faculties.controller";

export const facultiesRouter = express.Router();
facultiesRouter.get("/", facultiesController.getAllFaculties);
facultiesRouter.get("/faculty", facultiesController.getFacultyById);
facultiesRouter.delete("/faculty", facultiesController.deleteFacultyById);
facultiesRouter.post("/faculty", facultiesController.createFaculty);
facultiesRouter.put("/faculty", facultiesController.updateFaculty);
