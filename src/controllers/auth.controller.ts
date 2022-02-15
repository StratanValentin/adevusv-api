import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  if (!("body" in req)) {
    res.send({
      message: "Body error",
    });
    return;
  }

  if (!req?.body || !req?.body?.email || !req?.body?.parola) {
    res.send({
      message: "Email or password not provided",
    });
    return;
  }
  const { email, parola } = req.body;
  const user = await validareAuth(email, parola);
  res.send(user || { message: "Utilizator cu aceste date nu a fost gasit" });
};

const validareAuth = async (email: string, parola: string): Promise<any> => {
  let user = null;

  user = await prisma.studenti.findFirst({
    where: {
      email: email,
      parola: parola,
    },
  });
  if (user && "id_student" in user) return user;

  user = await prisma.secretari.findFirst({
    where: {
      email: email,
      parola: parola,
    },
  });
  if (user && "id_secretar" in user) return user;

  user = await prisma.administratori.findFirst({
    where: {
      email: email,
      parola: parola,
    },
  });
  if (user && "id_administrator" in user) return user;
  return null;
};
