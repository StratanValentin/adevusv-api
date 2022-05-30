import express from "express";
import * as filesController from "../controllers/files.controller";
import multer from "multer";

const storage = multer.memoryStorage();
const docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    //   console.log(req);
    console.log(file);
    cb(null, file.originalname + "-" + Date.now() + ".zip");
  },
});
const upload = multer({ storage: storage });
const docUpload = multer({ storage: docStorage });

export const filesRouter = express.Router();
filesRouter.post("/", upload.single("file"), filesController.parseSpreadsheet);
filesRouter.post(
  "/rm",
  upload.single("file"),
  filesController.deleteFromSpreadsheet
);
filesRouter.post(
  "/document",
  docUpload.single("file"),
  filesController.fileUpload
);

const signaturesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    //   console.log(req);
    // console.log(file);
    // console.log(req);
    const newName = Date.now() + "-" + file.originalname;
    req.body["name"] = newName;
    cb(null, newName);
  },
});
const signaturesUpload = multer({ storage: signaturesStorage });

filesRouter.post(
  "/signatures",
  signaturesUpload.single("file"),
  filesController.signatureUpload
);
