import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as XLSX from "xlsx";

export const parseSpreadsheet = async (req: Request, res: Response) => {
  const workbook = await XLSX.readFile(__dirname + "/MOCK_STUDENTS.xlsx");

  for (let sheet of workbook.SheetNames) {
    const dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  }

  res.send({ message: "Spreadsheet endpoint" });
};
