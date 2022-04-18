import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllFaculties = async (req: Request, res: Response) => {
  const faculties = await prisma.facultati.findMany();
  res.send(faculties);
};
