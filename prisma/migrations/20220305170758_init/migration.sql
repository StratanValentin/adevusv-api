-- CreateTable
CREATE TABLE "facultati" (
    "id_facultate" SERIAL NOT NULL,
    "nume_facultate" TEXT NOT NULL,
    "nume_prescurtat_facultate" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facultati_pkey" PRIMARY KEY ("id_facultate")
);

-- CreateTable
CREATE TABLE "secretari" (
    "id_secretar" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "parola" TEXT NOT NULL,
    "nume" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_facultate" INTEGER NOT NULL,

    CONSTRAINT "secretari_pkey" PRIMARY KEY ("id_secretar")
);

-- CreateTable
CREATE TABLE "studenti" (
    "id_student" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "parola" TEXT NOT NULL,
    "nume" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_facultate" INTEGER NOT NULL,

    CONSTRAINT "studenti_pkey" PRIMARY KEY ("id_student")
);

-- CreateTable
CREATE TABLE "administratori" (
    "id_administrator" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "parola" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administratori_pkey" PRIMARY KEY ("id_administrator")
);

-- CreateTable
CREATE TABLE "documente" (
    "id_document" SERIAL NOT NULL,
    "nume" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "cuvinte_rezervate" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "id_facultate" INTEGER NOT NULL,

    CONSTRAINT "documente_pkey" PRIMARY KEY ("id_document")
);

-- CreateIndex
CREATE UNIQUE INDEX "facultati_nume_facultate_key" ON "facultati"("nume_facultate");

-- CreateIndex
CREATE UNIQUE INDEX "facultati_nume_prescurtat_facultate_key" ON "facultati"("nume_prescurtat_facultate");

-- CreateIndex
CREATE UNIQUE INDEX "secretari_email_key" ON "secretari"("email");

-- CreateIndex
CREATE UNIQUE INDEX "studenti_email_key" ON "studenti"("email");

-- CreateIndex
CREATE UNIQUE INDEX "administratori_email_key" ON "administratori"("email");

-- CreateIndex
CREATE UNIQUE INDEX "documente_nume_key" ON "documente"("nume");

-- AddForeignKey
ALTER TABLE "secretari" ADD CONSTRAINT "secretari_id_facultate_fkey" FOREIGN KEY ("id_facultate") REFERENCES "facultati"("id_facultate") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studenti" ADD CONSTRAINT "studenti_id_facultate_fkey" FOREIGN KEY ("id_facultate") REFERENCES "facultati"("id_facultate") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documente" ADD CONSTRAINT "documente_id_facultate_fkey" FOREIGN KEY ("id_facultate") REFERENCES "facultati"("id_facultate") ON DELETE CASCADE ON UPDATE CASCADE;
