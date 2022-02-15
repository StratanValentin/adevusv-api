import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.facultati.upsert({
    where: {
      id_facultate: 1,
    },
    update: {},
    create: {
      nume_facultate:
        "Facultatea de Inginerie Electrica si Stiinta Calculatoarelor",
      nume_prescurtat_facultate: "FIESC",
      secretari: {
        create: [
          {
            email: "secretar@adeusv.ro",
            parola: "secretar",
            nume: "Andreia",
            prenume: "Marin",
          },
          {
            email: "secretar.marin@adevusv.ro",
            parola: "secretar",
            nume: "Mihaela",
            prenume: "Mihai",
          },
        ],
      },
      studenti: {
        create: [
          {
            email: "valentin.stratan@student.usv.ro",
            parola: "Student226854",
            nume: "Valentin",
            prenume: "Stratan",
          },
        ],
      },
      documente: {},
    },
  });

  await prisma.administratori.upsert({
    where: {
      id_administrator: 1,
    },
    update: {},
    create: {
      email: "admin@adevusv.ro",
      parola: "admin",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
