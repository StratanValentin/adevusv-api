import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { parse } from "himalaya";
const himalaya = require("himalaya");
import PDFDocument from "pdfkit";
const prisma = new PrismaClient();

import { documentInProgressStatus } from "../constants";

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
      id_document: req.body.id_document,
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
  if (
    !("nume" in req.body) ||
    !("html" in req.body) ||
    !("cuvinte_rezervate" in req.body)
  ) {
    res.send({
      error: "Datele nu au fost primite",
    });
  }

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
      id_document: req.body.id_document,
    },
  });

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

  await prisma.procesare_documente.create({
    data: {
      status: documentInProgressStatus,
      id_document: documentData?.id_document,
      id_facultate: documentData?.id_facultate,
      id_student: req.body.id_student,
      html: documentData?.html,
      cuvinte_rezervate: req.body.cuvinte_rezervate,
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
  });

  res.send(documents);
};
