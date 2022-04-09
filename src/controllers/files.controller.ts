import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as XLSX from "xlsx";

export const parseSpreadsheet = async (req: Request, res: Response) => {
  const workbook = await XLSX.readFile(__dirname + "/MOCK_STUDENTS.xlsx");

  let dataArray: any = [];

  for (let sheet of workbook.SheetNames) {
    dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    for (let data of dataArray) {
      try {
        await prisma.studenti.upsert({
          where: {
            email: data.Email,
          },
          update: {
            nume: data.Nume,
            parola: `Student${data.CNP.toString().substr(
              data.CNP.toString().length - 6
            )}`,
            email: data.Email,
            cnp: data.CNP,
            an: data.An,
            specializare: data.Specializare,
            taxa: data.taxa === "true" ? true : false,
            grupa: data.Grupa.toString(),
            id_facultate: 1,
          },
          create: {
            nume: data.Nume,
            parola: `Student${data.CNP.toString().substr(
              data.CNP.toString().length - 6
            )}`,
            email: data.Email,
            cnp: data.CNP,
            an: data.An,
            specializare: data.Specializare,
            taxa: data.taxa === "true" ? true : false,
            grupa: data.Grupa.toString(),
            id_facultate: 1,
          },
        });
        console.log(`==> ${data.Email} upserted!`);
      } catch (error) {
        console.log(`==> Upsert Error: ${error}`);
      }
    }
  }

  res.send({ message: "Spreadsheet endpoint" });
};
