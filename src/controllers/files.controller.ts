import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as XLSX from "xlsx";

export const parseSpreadsheet = async (req: Request, res: Response) => {
  console.log(`Received file:`);

  console.log(req.file);

  const workbook = await XLSX.read(req.file?.buffer);

  let dataArray: any = [];

  res.send({ message: "Spreadsheet endpoint" });

  for (let sheet of workbook.SheetNames) {
    dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    let i = 0;
    for (let data of dataArray) {
      // console.log(data);
      i++;

      // if (i > 5) break;

      try {
        console.log({
          email: data.Email,
          an: data.An,
          specializare: data.Specializare,
          grupa: data.Grupa,
        });

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
            cnp: `${data.CNP}`,
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
            cnp: `${data.CNP}`,
            an: data.An,
            specializare: data.Specializare,
            taxa: data.taxa === "true" ? true : false,
            grupa: data.Grupa.toString(),
            id_facultate: 1,
          },
        });
        console.log(`==> ${data.Nr} upserted!`);
      } catch (error) {
        console.log(`==> Upsert Error: ${error}`);
      }
    }
  }
  return;
};

// export const parseDocx = async (req: Request, res: Response) => {
//   console.log(`Received file:`);
//   console.log(req.file);
//   //req.file?.buffer

//   res.send({ message: "Spreadsheet endpoint" });
// };

const fs = require("fs");
const unzipper = require("unzipper");
const xml2js = require("xml2js");
const path = require("path");

function streamUnzipper(stream: any) {
  // console.log('started stream waiting')
  return new Promise((resolve, reject) => {
    stream.on("close", () => resolve("Finished"));
  });
}

export const fileUpload = async (request: Request, response: Response) => {
  try {
    console.log("File uploaded");
    let htmlData: any = "";
    const fileName = request?.file?.filename;
    if (!fileName) return;

    console.log("Filename: ", fileName);
    const newFileName = "folder-" + fileName.replace(".zip", "");
    console.log("New filename: ", newFileName);
    const filePath = path.join(
      __dirname + "/../../" + "uploads/" + `${fileName}`
    );
    console.log("Filepath: ", filePath);
    let newFilePath = path.join(
      __dirname + "/../../" + "uploads/" + `${newFileName}`
    );
    console.log("New Filepath: ", newFilePath);
    const streamm = fs
      .createReadStream(
        path.join(__dirname + "/../../" + "uploads/" + fileName)
      )
      .pipe(
        unzipper.Extract({
          path: path.join(__dirname + "/../../" + "uploads/" + newFileName),
        })
      );

    await streamUnzipper(streamm);
    const pathData = path.join(newFilePath, "word", "document.xml");
    console.log(`after pathData`);
    try {
      htmlData = await htmlProcess(pathData);
    } catch (error) {
      console.log(error);
    }

    console.log(`after htmlData`);

    // console.log(htmlData);
    fs.rmSync(filePath, {
      recursive: true,
    });
    fs.rmdirSync(newFilePath, { recursive: true }, (err: any) => {
      if (err) console.log(err);
      else console.log("deleted");
    });

    console.log(htmlData);

    response.status(200).send({
      html: htmlData,
    });
    // return {
    //   html: JSON.stringify(htmlData),
    // };
  } catch (err) {
    console.log(err);
  }
};

async function htmlProcess(path: any) {
  // const htmlFile = await loadHtmlFile('adeverinta.html');
  // let wordFileXml = fs.readFileSync('./src/htmls/adeverinta.html');
  let wordFileXml = fs.readFileSync(path);
  wordFileXml = wordFileXml.toString();
  let wordFileJson;
  // console.log(wordFileXml)
  xml2js.parseString(wordFileXml, (err: any, result: any) => {
    if (err) {
      throw err;
    }
    wordFileJson = result;
  });

  // console.log(wordFileJson);

  if (!wordFileJson) return;

  const docxBody = wordFileJson["w:document"]["w:body"];
  console.log(docxBody);

  const docxParagraphs: any = docxBody[0]["w:p"];
  let convertedDocxToHtml = "";
  for (let key in docxParagraphs) {
    // console.log(docxParagraphs[key])
    if (docxParagraphs[key]["w:r"]) {
      const docxParagraphAlign = docxParagraphs[key]["w:pPr"][0];
      let defaultAlign;
      if (
        docxParagraphAlign["w:jc"] &&
        docxParagraphAlign["w:jc"][0]["$"]["w:val"]
      ) {
        defaultAlign = docxParagraphAlign["w:jc"][0]["$"]["w:val"];
      }

      const docxParagraphData = docxParagraphs[key]["w:r"];
      let sentenceString = "";
      docxParagraphData.forEach((item: any) => {
        let boldTag = false;

        // set styling tags
        if (item["w:rPr"][0]) {
          const stylingObj = item["w:rPr"][0];
          if (stylingObj["w:b"]) {
            boldTag = true;
          }
        }

        // get text data
        if (item["w:t"]) {
          item["w:t"].forEach((text: any) => {
            if (typeof text === "object" && text !== null) {
              if (text["_"]) {
                sentenceString += text["_"].replace(/(\r\n|\n|\r)/gm, "");
                if (boldTag)
                  sentenceString = "<strong>" + sentenceString + "</strong>";
              }
            } else {
              if (text) {
                sentenceString += text.replace(/(\r\n|\n|\r)/gm, "");
                if (boldTag)
                  sentenceString = "<strong>" + sentenceString + "</strong>";
              }
            }
          });
        }
      });

      switch (defaultAlign) {
        case "left":
          sentenceString = "<p>" + sentenceString + "</p>";
          break;
        case "center":
          sentenceString =
            '<p style="text-align:center;">' + sentenceString + "</p>";
          break;
        case "right":
          sentenceString =
            '<p style="text-align:right;">' + sentenceString + "</p>";
          break;
        default:
          sentenceString = "<p>" + sentenceString + "</p>";
      }

      // console.log(sentenceString);
      // console.log('---------------------------');
      convertedDocxToHtml += `${sentenceString}\n`;
    }
  }

  return convertedDocxToHtml;
}

export const signatureUpload = async (req: Request, res: Response) => {
  try {
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

    const secretary = await prisma.secretari.findFirst({
      where: {
        id_secretar: idSecretary,
      },
    });

    // console.log(secretary);
    // console.log(req.body);
    if (secretary) {
      const oldFile = secretary.semnatura;

      // up date secretary and set new filename
      await prisma.secretari.update({
        where: {
          id_secretar: secretary.id_secretar,
        },
        data: {
          semnatura: req.body.name,
        },
      });
      // remove old file
      const filePath = path.join(
        __dirname + "/../../" + "uploads/" + `${oldFile}`
      );
      fs.rmSync(filePath, {
        recursive: true,
      });
    }

    res.status(200).send({});
  } catch (err) {
    console.log(err);
  }
};

export const deleteFromSpreadsheet = async (req: Request, res: Response) => {
  console.log(`Received file:`);

  console.log(req.file);

  const workbook = await XLSX.read(req.file?.buffer);

  let dataArray: any = [];

  res.send({ message: "Spreadsheet endpoint" });

  for (let sheet of workbook.SheetNames) {
    dataArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    let i = 0;

    // await prisma.studenti.deleteMany({
    //   where: {
    //     email: {
    //       in: dataArray.map((a: any) => a.Email),
    //     },
    //   },
    // });

    for (let data of dataArray) {
      // console.log(data);
      i++;

      if (i > 2) break;

      try {
        console.log({
          email: data.Email,
          an: data.An,
          specializare: data.Specializare,
          grupa: data.Grupa,
        });

        await prisma.studenti.delete({
          where: {
            email: data.Email,
          },
        });

        console.log(`==> ${data.Nr} deleted!`);
      } catch (error) {
        console.log(`==> Upsert Error: ${error}`);
      }
    }
  }
  return;
};
