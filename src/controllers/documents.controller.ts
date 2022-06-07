import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { parse } from "himalaya";
const himalaya = require("himalaya");
import PDFDocument from "pdfkit";
const prisma = new PrismaClient();

import {
  documentApprovedStatus,
  documentInProgressStatus,
  documentRejectedStatus,
} from "../constants";
import path from "path";

export const getDocuments = async (req: Request, res: Response) => {
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

  const documente = await prisma.documente.findMany({
    where: {
      id_facultate: idFacultate,
    },
  });

  res.send(documente);
};

export const updateDocument = async (req: Request, res: Response) => {
  if (
    !("id_document" in req.body) ||
    !("nume" in req.body) ||
    !("html" in req.body) ||
    !("cuvinte_rezervate" in req.body)
  ) {
    res.send({
      error: "Datele nu au fost primite",
    });
  }

  console.log(req.body);

  await prisma.documente.update({
    where: {
      id_document: parseInt(req.body.id_document as string),
    },
    data: {
      nume: req.body.nume,
      html: req.body.html,
      cuvinte_rezervate: req.body.cuvinte_rezervate,
    },
  });

  res.send({ message: "Document updated!" });
};

export const createDocument = async (req: Request, res: Response) => {
  console.log(`IN CREATE DOC`);

  console.log(req.body);

  if (
    !req ||
    !("body" in req) ||
    !("nume" in req.body) ||
    !("html" in req.body) ||
    !("cuvinte_rezervate" in req.body)
  ) {
    res.send({
      error: "Datele nu au fost primite",
    });
    return;
  }

  console.log("AICI");

  console.log(req.body);

  await prisma.documente.create({
    data: {
      nume: req.body.nume,
      html: req.body.html,
      id_facultate: req.body.id_facultate,
      cuvinte_rezervate: req.body.cuvinte_rezervate,
    },
  });

  res.send({ message: "Document updated!" });
};

export const generatePdfFromDocument = async (req: Request, res: Response) => {
  if (!("html" in req.body)) {
    res.send({
      error: "Something went wrong..",
    });
  }

  const html = req.body.html;

  const paragraphsArray: {
    content: any;
    align: string;
    strongFlag: boolean;
  }[] = [];

  const htmlArray = himalaya.parse(html);

  htmlArray.forEach((element: any, index: number) => {
    let strongFlag = false;
    let align = `left`;
    let content = "";

    console.log(element);

    if (element.children && element.children[0]) {
      let children = element.children[0];

      if (element.type && element.type === "element") {
        if (element.tagName === "p") {
          if (element.attributes && element.attributes[0]) {
            align = element.attributes[0].value;
          }
        }
      }

      while (children != null) {
        if (children.type && children.type === "element") {
          if (children.tagName === "strong") {
            strongFlag = true;
          }
        } else if (children.type && children.type === "text") {
          content = children.content.replace(new RegExp("&nbsp;", "g"), " ");
        }

        if (children.children && children.children[0]) {
          children = children.children[0];
        } else {
          children = null;
        }
      }

      console.log(content);
    } else if (element.type === "text" && element.content === "\n") {
      content = "\n";
    }

    if (content) {
      paragraphsArray.push({ content, align, strongFlag });
    }
  });

  const doc = new PDFDocument({ autoFirstPage: false, size: "A4" });

  doc.registerFont(
    "Abhaya Regular",
    "fonts/abhaya-libre/AbhayaLibre-Regular.ttf"
  );

  doc.registerFont("Abhaya Bold", "fonts/abhaya-libre/AbhayaLibre-Bold.ttf");

  doc.addPage({
    margin: 50,
  });

  paragraphsArray.forEach((item, index) => {
    let align = item.align.substring(
      item.align.indexOf(":") + 1,
      item.align.indexOf(";")
    );

    align = align ? align : "left";

    console.log(align);
    console.log(item.content);

    doc
      .fontSize(12)
      .font(item.strongFlag ? "Abhaya Bold" : "Abhaya Regular")
      .text(item.content, {
        width: 500,
        align,
      });
  });

  doc.pipe(res);

  doc.end();
};

export const getReservedWordsByDocumentId = async (
  req: Request,
  res: Response
) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_document) {
    res.send({
      error: "Id document nu a fost primit!",
    });
    return;
  }

  const id_document: number = parseInt(req.query.id_document as string);

  const reservedWords = await prisma.documente.findUnique({
    select: {
      id_document: true,
      cuvinte_rezervate: true,
    },
    where: {
      id_document,
    },
  });

  res.send(reservedWords);
};

export const createDocumentRequest = async (req: Request, res: Response) => {
  if (
    !("id_document" in req.body) ||
    !("cuvinte_rezervate" in req.body) ||
    !("id_student" in req.body)
  ) {
    res.send({
      error: "Datele nu au fost primite",
    });
    return;
  }

  const documentData = await prisma.documente.findUnique({
    where: {
      id_document: parseInt(req.body.id_document),
    },
  });

  const student = await prisma.studenti.findUnique({
    where: { id_student: req.body.id_student },
  });

  if (!student || !("id_student" in student)) {
    res.send({ errorMessage: "Student not found" });
    return;
  }

  if (
    !documentData ||
    documentData === null ||
    !("id_document" in documentData)
  ) {
    res.send({ errorMessage: "Document not found" });
    return;
  }

  if (!documentData?.html) {
    res.send({ errorMessage: "Document is empty" });
    return;
  }

  /*
  <option value="aprobare">Completat la aprobare</option>
  <option value="student">Completat de student</option>
  <option value="numeprenume">Nume si Prenume</option>
  <option value="specializare">Specializare</option>
  <option value="grupa">Grupa</option>
  <option value="an">Anul de studiu</option>
  <option value="cnp">CNP</option>
  <option value="email">Email</option>
  <option value="taxa">Taxa</option>
  <option value="semnatura secretariat">Semnatura secretarului</option>
  <option value="stampila decan">Semnatura decaunului si stampila</option>
  */

  const cuvinte_rezervate: any = req.body.cuvinte_rezervate;

  // process reserved words
  if (cuvinte_rezervate && cuvinte_rezervate !== null) {
    for (let key in cuvinte_rezervate) {
      switch (cuvinte_rezervate[key]) {
        case "numeprenume":
          cuvinte_rezervate[key] = student.nume;
          break;
        case "specializare":
          cuvinte_rezervate[key] = student.specializare;
          break;
        case "grupa":
          cuvinte_rezervate[key] = student.grupa;
          break;
        case "an":
          cuvinte_rezervate[key] = student.an;
          break;
        case "cnp":
          cuvinte_rezervate[key] = student.cnp;
          break;
        case "email":
          cuvinte_rezervate[key] = student.email;
          break;
        case "taxa":
          cuvinte_rezervate[key] =
            student.taxa === true ? "cu taxă" : "fară taxă";
          break;
        default:
          continue;
      }
    }
  }

  await prisma.procesare_documente.create({
    data: {
      status: documentInProgressStatus,
      id_document: documentData?.id_document,
      id_facultate: documentData?.id_facultate,
      id_student: req.body.id_student,
      html: documentData?.html,
      cuvinte_rezervate,
    },
  });

  res.send({ message: "Document requested!" });
};

export const getAllDocumentsInprocessingByStudentId = async (
  req: Request,
  res: Response
) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_student) {
    res.send({
      error: "Id student nu a fost primit!",
    });
    return;
  }

  const id_student: number = parseInt(req.query.id_student as string);

  const documents = await prisma.procesare_documente.findMany({
    where: {
      id_student,
      status: documentInProgressStatus,
    },
    include: {
      documente: true,
    },
  });

  res.send(documents);
};

export const getAllDocumentsInprocessingByFacultyId = async (
  req: Request,
  res: Response
) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_facultate) {
    res.send({
      error: "Id faculty nu a fost primit!",
    });
    return;
  }

  const id_facultate: number = parseInt(req.query.id_facultate as string);

  const documents = await prisma.procesare_documente.findMany({
    where: {
      id_facultate,
      status: documentInProgressStatus,
    },
    include: {
      documente: true,
      studenti: true,
    },
  });

  res.send(documents);
};

export const getReservedWordsByInProcessDocumentId = async (
  req: Request,
  res: Response
) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_procesare) {
    res.send({
      error: "Id procesare nu a fost primit!",
    });
    return;
  }

  const id_procesare: number = parseInt(req.query.id_procesare as string);

  const reservedWords = await prisma.procesare_documente.findUnique({
    where: {
      id_procesare,
    },
  });

  res.send(reservedWords);
};

export const rejectInProcessingDocument = async (
  req: Request,
  res: Response
) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_procesare) {
    res.send({
      error: "Id procesare nu a fost primit!",
    });
    return;
  }
  const id_procesare: number = parseInt(req.query.id_procesare as string);
  const updateResponse = await prisma.procesare_documente.update({
    where: { id_procesare },
    data: {
      status: documentRejectedStatus,
      mesaj_de_refuz: req.body.mesaj,
    },
  });
  res.send(updateResponse);
};

export const approveInProcessingDocument = async (
  req: Request,
  res: Response
) => {
  if (!("id_procesare" in req.body) || !("html" in req.body)) {
    res.send({
      error: "Datele nu au fost primite",
    });
    return;
  }

  const id_procesare: number = parseInt(req.body.id_procesare as string);

  const updateResponse = await prisma.procesare_documente.update({
    where: { id_procesare },
    data: {
      status: documentApprovedStatus,
      html: req.body.html,
    },
  });
  res.send(updateResponse);
};
/*
export const getAllDocumentsInprocessingByStudentId = async (
  req: Request,
  res: Response
) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_student) {
    res.send({
      error: "Id student nu a fost primit!",
    });
    return;
  }

  const id_student: number = parseInt(req.query.id_student as string);

  const documents = await prisma.procesare_documente.findMany({
    where: {
      id_student,
      status: documentInProgressStatus,
    },
    include: {
      documente: true,
    },
  });

  res.send(documents);
};
*/
export const getAllDocumentsProcessedByStudentId = async (
  req: Request,
  res: Response
) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.id_student) {
    res.send({
      error: "Id student nu a fost primit!",
    });
    return;
  }

  const id_student: number = parseInt(req.query.id_student as string);

  const documents = await prisma.procesare_documente.findMany({
    where: {
      id_student,
      status: {
        in: [
          documentRejectedStatus,
          documentApprovedStatus,
          documentInProgressStatus,
        ],
      },
      html: req.body.html,
    },
    include: {
      documente: true,
    },
  });

  res.send(documents);
};

export const getDocumentData = async (req: Request, res: Response) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.idDocument) {
    res.send({
      error: "Id document nu a fost primit!",
    });
    return;
  }

  const id_document: number = parseInt(req.query.idDocument as string);

  const data = await prisma.documente.findUnique({
    where: {
      id_document,
    },
  });

  res.send(data);
};

export const deleteDocumentById = async (req: Request, res: Response) => {
  if (!("query" in req)) {
    res.send({
      error: "Query error",
    });
    return;
  }

  if (!req?.query || !req?.query?.idDocument) {
    res.send({
      error: "Id document nu a fost primit!",
    });
    return;
  }

  const idDocument: number = parseInt(req.query.idDocument as string);

  if (isNaN(idDocument)) {
    res.send({
      error: "Id document NaN!",
    });
    return;
  }

  const document = await prisma.documente.delete({
    where: {
      id_document: idDocument,
    },
  });

  res.send(document);
};

export const generatePdfFromDocumentWithFaculty = async (
  req: Request,
  res: Response
) => {
  if (!("html" in req.body)) {
    res.send({
      error: "Something went wrong..",
    });
  }

  if (!("query" in req) || !("idFaculty" in req.query)) return;

  const faculty = await prisma.facultati.findFirst({
    where: {
      id_facultate: parseInt(req.query.idFaculty as string),
    },
  });

  const secretary = await prisma.secretari.findFirst({
    where: {
      id_facultate: faculty?.id_facultate,
    },
  });

  const html = req.body.html;

  const paragraphsArray: {
    content: any;
    align: string;
    strongFlag: boolean;
  }[] = [];

  const htmlArray = himalaya.parse(html);

  htmlArray.forEach((element: any, index: number) => {
    let strongFlag = false;
    let align = `left`;
    let content = "";

    console.log(element);

    if (element.children && element.children[0]) {
      let children = element.children[0];

      if (element.type && element.type === "element") {
        if (element.tagName === "p") {
          if (element.attributes && element.attributes[0]) {
            align = element.attributes[0].value;
          }
        }
      }

      while (children != null) {
        if (children.type && children.type === "element") {
          if (children.tagName === "strong") {
            strongFlag = true;
          }
        } else if (children.type && children.type === "text") {
          content = children.content.replace(new RegExp("&nbsp;", "g"), " ");
        }

        if (children.children && children.children[0]) {
          children = children.children[0];
        } else {
          children = null;
        }
      }

      console.log(content);
    } else if (element.type === "text" && element.content === "\n") {
      content = "\n";
    }

    if (content) {
      paragraphsArray.push({ content, align, strongFlag });
    }
  });

  const doc = new PDFDocument({ autoFirstPage: false, size: "A4" });

  doc.registerFont(
    "Abhaya Regular",
    "fonts/abhaya-libre/AbhayaLibre-Regular.ttf"
  );

  doc.registerFont("Abhaya Bold", "fonts/abhaya-libre/AbhayaLibre-Bold.ttf");

  doc.addPage({
    margin: 50,
  });

  paragraphsArray.forEach((item, index) => {
    let align = item.align.substring(
      item.align.indexOf(":") + 1,
      item.align.indexOf(";")
    );

    align = align ? align : "left";

    console.log(`----------------------`);
    console.log(align);
    console.log(item.content);

    if (item.content.includes("#semnatura secretariat%")) {
      // console.log(`ADD PICTURe`);
      doc.image(
        path.join(
          __dirname + "/../../" + "uploads/" + `${secretary?.semnatura}`
        ),
        undefined,
        undefined,
        { align: "center", fit: [100, 100] }
      );
    } else if (item.content.includes("#stampila decan%")) {
      doc.image(
        path.join(__dirname + "/../../" + "uploads/" + `${faculty?.stampila}`),
        undefined,
        undefined,
        { align: "center", fit: [100, 100] }
      );
    } else {
      doc
        .fontSize(12)
        .font(item.strongFlag ? "Abhaya Bold" : "Abhaya Regular")
        .text(item.content, {
          width: 500,
          align,
        });
    }
  });

  doc.pipe(res);

  doc.end();
};
