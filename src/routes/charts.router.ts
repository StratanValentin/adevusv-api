import express from "express";
import * as chartsController from "../controllers/charts.controller";

export const chartsRouter = express.Router();
chartsRouter.get("/facultyChart", chartsController.getFacultyChartData);
chartsRouter.get("/documentsChart", chartsController.getDocumentsChartData);
chartsRouter.get("/requestsChart", chartsController.getRequestsChartData);
