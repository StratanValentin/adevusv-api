import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllFaculties = async (req: Request, res: Response) => {
  const faculties = await prisma.facultati.findMany({
    orderBy: {
      nume_facultate: "desc",
    },
  });
  res.send(faculties);
};

export const getFacultyById = async (req: Request, res: Response) => {
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

  if (isNaN(idFacultate)) {
    res.send({
      error: "Id facultate NaN!",
    });
    return;
  }

  const faculty = await prisma.facultati.findUnique({
    where: {
      id_facultate: idFacultate,
    },
  });

  if (!faculty) {
    res.send({
      message: "Facultate nu a fost gasita.",
    });
    return;
  }

  res.send(faculty);
};

export const deleteFacultyById = async (req: Request, res: Response) => {
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

  if (isNaN(idFacultate)) {
    res.send({
      error: "Id facultate NaN!",
    });
    return;
  }

  const faculty = await prisma.facultati.delete({
    where: {
      id_facultate: idFacultate,
    },
  });

  res.send(faculty);
};

export const createFaculty = async (req: Request, res: Response) => {
  if (
    !("body" in req) ||
    !("facultyName" in req.body) ||
    !("facultyShortenName" in req.body)
  ) {
    res.send({
      errorMessage: "Invalid data provided",
    });
    return;
  }
  const faculty = await prisma.facultati.create({
    data: {
      nume_facultate: req.body.facultyName,
      nume_prescurtat_facultate: req.body.facultyShortenName,
    },
  });

  res.send(faculty);
};

export const updateFaculty = async (req: Request, res: Response) => {
  if (
    !("body" in req) ||
    !("idFaculty" in req.body) ||
    !("facultyName" in req.body) ||
    !("facultyShortenName" in req.body)
  ) {
    res.send({
      errorMessage: "Invalid data provided",
    });
    return;
  }

  const idFaculty: number = parseInt(req.body.idFaculty as string);

  const faculty = await prisma.facultati.update({
    where: {
      id_facultate: idFaculty,
    },
    data: {
      nume_facultate: req.body.facultyName,
      nume_prescurtat_facultate: req.body.facultyShortenName,
    },
  });

  res.send(faculty);
};
