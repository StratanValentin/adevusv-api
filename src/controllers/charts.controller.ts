import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getFacultyChartData = async (req: Request, res: Response) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_facultate) {
    res.send({
      error: "Id facultate nu a fost primit!",
    });
    return;
  }

  const idFacultate: number = parseInt(req.query.id_facultate as string);

  //   console.log(idFacultate);

  if (isNaN(idFacultate)) {
    // console.log(`AICI`);

    res.send({
      error: "Id facultate NaN!",
    });
    return;
  }

  const students = await prisma.studenti.findMany({
    where: {
      id_facultate: idFacultate,
    },
  });

  //   console.log(students.length);
  const data: any = {};

  students.forEach((student) => {
    if (!data[student.specializare]) {
      data[student.specializare] = 1;
    } else {
      data[student.specializare]++;
    }
  });

  res.send(data);
};
