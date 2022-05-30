import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getStudentsLists = async (req: Request, res: Response) => {
  if (!req?.query || !req?.query?.id_facultate) {
    res.send({
      error: "Id facultate nu a fost primit!",
    });
    return;
  }

  const idFacultate: number = parseInt(req.query.id_facultate as string);

  const students = await prisma.studenti.findMany({
    where: {
      id_facultate: idFacultate,
    },
  });

  const finalList: any = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const { specializare, an, grupa, email, cnp, id_student, nume, taxa } =
      student;

    // --- handle new specialization ---
    let specializationIndex = finalList.findIndex((specialization: any) => {
      return specialization.name === specializare;
    });
    if (specializationIndex === -1) {
      finalList.push({
        open: false,
        name: specializare,
        years: [],
      });
    }

    // --- handle new year ---

    specializationIndex = finalList.findIndex((specialization: any) => {
      return specialization.name === specializare;
    });

    if (
      finalList[specializationIndex].years.findIndex((year: any) => {
        return year.year === an;
      }) === -1
    ) {
      finalList[specializationIndex].years.push({
        open: false,
        year: an,
        groups: [],
      });
    }

    // --- handle new group ---

    let yearIndex = finalList[specializationIndex].years.findIndex(
      (year: any) => {
        return year.year === an;
      }
    );

    if (
      finalList[specializationIndex].years[yearIndex].groups.findIndex(
        (group: any) => {
          return group.groupName === grupa;
        }
      ) === -1
    ) {
      finalList[specializationIndex].years[yearIndex].groups.push({
        open: false,
        groupName: grupa,
        students: [],
      });
    }

    // -- handle new student

    let groupIndex = finalList[specializationIndex].years[
      yearIndex
    ].groups.findIndex((group: any) => {
      return group.groupName === grupa;
    });

    if (
      finalList[specializationIndex].years[yearIndex].groups[
        groupIndex
      ].students.findIndex((student: any) => {
        return student.email === email;
      })
    ) {
      finalList[specializationIndex].years[yearIndex].groups[
        groupIndex
      ].students.push({
        id: id_student,
        email,
        cnp,
        name: nume,
        taxa: taxa ? "cu taxa" : "fara taxa",
      });
    }
  }

  for (let specialization of finalList) {
    specialization.years.sort((item1: any, item2: any) => {
      if (item1.year < item2.year) return -1;
      else return 1;
    });

    finalList[specialization] = specialization;
  }

  res.send(finalList);
};

export const getStudentById = async (req: Request, res: Response) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.idStudent) {
    res.send({
      error: "Id student nu a fost primit!",
    });
    return;
  }

  const idStudent: number = parseInt(req.query.idStudent as string);

  if (isNaN(idStudent)) {
    res.send({
      error: "Id secretar NaN!",
    });
    return;
  }

  const student = await prisma.studenti.findUnique({
    where: {
      id_student: idStudent,
    },
    include: {
      facultati: true,
    },
  });

  if (!student) {
    res.send({
      message: "Student nu a fost gasita.",
    });
    return;
  }

  res.send(student);
};

export const deleteStudentById = async (req: Request, res: Response) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.idStudent) {
    res.send({
      error: "Id secretar nu a fost primit!",
    });
    return;
  }

  const idStudent: number = parseInt(req.query.idStudent as string);

  if (isNaN(idStudent)) {
    res.send({
      error: "Id student NaN!",
    });
    return;
  }

  const student = await prisma.studenti.delete({
    where: {
      id_student: idStudent,
    },
  });

  res.send(student);
};

export const updateStudent = async (req: Request, res: Response) => {
  if (
    !("body" in req) ||
    !("idStudent" in req.body) ||
    !("email" in req.body) ||
    !("name" in req.body) ||
    !("cnp" in req.body) ||
    !("group" in req.body) ||
    !("specialization" in req.body) ||
    !("taxa" in req.body)
  ) {
    res.send({
      errorMessage: "Invalid data provided",
    });
    return;
  }
  const idStudent: number = parseInt(req.body.idStudent as string);

  const secretary = await prisma.studenti.update({
    where: {
      id_student: idStudent,
    },
    data: {
      email: req.body.email,
      nume: req.body.name,
      cnp: req.body.cnp,
      grupa: req.body.group,
      specializare: req.body.specialization,
      taxa: req.body.taxa,
    },
  });

  res.send(secretary);
};
