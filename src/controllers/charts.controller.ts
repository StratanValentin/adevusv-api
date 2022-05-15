import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { format, subYears, getMonth, subMonths } from "date-fns";
import { monthsObj } from "../utils/constants";

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

  if (isNaN(idFacultate)) {
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

export const getDocumentsChartData = async (req: Request, res: Response) => {
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

  const requestedDocuments = await prisma.procesare_documente.findMany({
    where: {
      id_facultate: idFacultate,
    },
    include: {
      documente: true,
    },
  });

  const totalDocuments = requestedDocuments.length;
  const docsObj: any = {};
  const labels: any = [];
  const data: any = [];

  requestedDocuments.forEach((request) => {
    const docName = request.documente.nume;
    if (!(docName in docsObj)) {
      docsObj[docName] = 1;
    } else {
      docsObj[docName]++;
    }
  });

  for (let key in docsObj) {
    docsObj[key] = (docsObj[key] * 100) / totalDocuments;
    labels.push(key);
    data.push(docsObj[key]);
  }

  res.send({
    totalDocuments,
    docsObj,
    labels,
    data,
  });
};

export const getRequestsChartData = async (req: Request, res: Response) => {
  const currentDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const startDate = format(subYears(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  const requestsData: any = [];

  let currentMonth = getMonth(new Date());

  requestsData.unshift({
    monthNumber: currentMonth,
    month: monthsObj[currentMonth],
    count: 0,
  });

  // 11 months as first is hardcoded
  for (let i = 0; i < 11; i++) {
    if (currentMonth === 0) {
      currentMonth = 11;

      requestsData.unshift({
        month: monthsObj[currentMonth],
        count: 0,
      });
    } else {
      currentMonth = currentMonth - 1;

      requestsData.unshift({
        month: monthsObj[currentMonth],
        count: 0,
      });
    }
  }

  let totalData = JSON.parse(JSON.stringify(requestsData));
  let approvedData = JSON.parse(JSON.stringify(requestsData));
  let rejectedData = JSON.parse(JSON.stringify(requestsData));
  const labels = requestsData.map((item: any) => item.month);

  const requests = await prisma.procesare_documente.findMany({
    where: {
      updated_at: {
        gte: startDate,
        lt: currentDate,
      },
    },
    orderBy: {
      updated_at: "desc",
    },
  });

  requests.forEach((requestItem) => {
    const month = format(requestItem.updated_at, "LLLL");

    const monthIndex = requestsData.findIndex((item: any) => {
      return item.month === month;
    });

    // console.log(`Found index ${monthIndex}`);

    totalData[monthIndex].count++;
    requestItem.status === "approved"
      ? approvedData[monthIndex].count++
      : requestItem.status === "rejected"
      ? rejectedData[monthIndex].count++
      : null;
  });

  totalData = totalData.map((item: any) => item.count);
  approvedData = approvedData.map((item: any) => item.count);
  rejectedData = rejectedData.map((item: any) => item.count);

  res.send({ totalData, approvedData, rejectedData, labels });
};
