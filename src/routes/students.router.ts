import express from "express";
import * as studentsController from "../controllers/students.controller";

export const studentsRouter = express.Router();
studentsRouter.get("/studentsLists", studentsController.getStudentsLists);
studentsRouter.get("/student", studentsController.getStudentById);
studentsRouter.delete("/student", studentsController.deleteStudentById);
studentsRouter.put("/student", studentsController.updateStudent);
