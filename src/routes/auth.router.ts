import express from "express";
import { customLog } from "../utils/logging.utils";
import * as auth from "../controllers/auth.controller";

export const authRouter = express.Router();
authRouter.post("/auth", auth.login);
