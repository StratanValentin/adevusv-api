import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllSecretaries = async (req: Request, res: Response) => {
  const faculties = await prisma.secretari.findMany();
  res.send(faculties);
};

export const createSecretary = async (req: Request, res: Response) => {
  if (
    !("body" in req) ||
    !("email" in req.body) ||
    !("name" in req.body) ||
    !("password" in req.body) ||
    !("idFaculty" in req.body)
  ) {
    res.send({
      errorMessage: "Invalid data provided",
    });
    return;
  }
  const secretary = await prisma.secretari.create({
    data: {
      email: req.body.email,
      nume: req.body.name,
      parola: req.body.password,
      id_facultate: req.body.idFaculty,
    },
  });

  res.send(secretary);
};

export const updateSecretary = async (req: Request, res: Response) => {
  if (
    !("body" in req) ||
    !("idSecretary" in req.body) ||
    !("email" in req.body) ||
    !("name" in req.body) ||
    !("password" in req.body) ||
    !("idFaculty" in req.body)
  ) {
    res.send({
      errorMessage: "Invalid data provided",
    });
    return;
  }
  const idSecretary: number = parseInt(req.body.idSecretary as string);

  const secretary = await prisma.secretari.update({
    where: {
      id_secretar: idSecretary,
    },
    data: {
      email: req.body.email,
      nume: req.body.name,
      parola: req.body.password,
      id_facultate: req.body.idFaculty,
    },
  });

  res.send(secretary);
};
export const getSecretaryById = async (req: Request, res: Response) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.idSecretary) {
    res.send({
      error: "Id secretar nu a fost primit!",
    });
    return;
  }

  const idSecretary: number = parseInt(req.query.idSecretary as string);

  if (isNaN(idSecretary)) {
    res.send({
      error: "Id secretar NaN!",
    });
    return;
  }

  const secretary = await prisma.secretari.findUnique({
    where: {
      id_secretar: idSecretary,
    },
  });

  if (!secretary) {
    res.send({
      message: "Secretar nu a fost gasita.",
    });
    return;
  }

  res.send(secretary);
};

export const deleteSecretaryById = async (req: Request, res: Response) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.idSecretary) {
    res.send({
      error: "Id secretar nu a fost primit!",
    });
    return;
  }

  const idSecretary: number = parseInt(req.query.idSecretary as string);

  if (isNaN(idSecretary)) {
    res.send({
      error: "Id secretar NaN!",
    });
    return;
  }

  const secretary = await prisma.secretari.delete({
    where: {
      id_secretar: idSecretary,
    },
  });

  res.send(secretary);
};
