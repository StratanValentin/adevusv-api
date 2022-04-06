import express from "express";
import cors from "cors";
import { customLog } from "./utils/logging.utils";
import { router } from "./routes/index.routes";
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Adevusv!",
  });
});

app.listen(process.env.PORT || 4100, () => {
  customLog(` ==> Server started on port 4100`);
});
