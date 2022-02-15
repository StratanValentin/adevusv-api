-- CreateTable
CREATE TABLE "facultati" (
    "id_facultate" SERIAL NOT NULL,
    "nume_facultate" TEXT NOT NULL,
    "nume_prescurtat_facultate" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facultati_pkey" PRIMARY KEY ("id_facultate")
);

-- CreateIndex
CREATE UNIQUE INDEX "facultati_nume_facultate_key" ON "facultati"("nume_facultate");

-- CreateIndex
CREATE UNIQUE INDEX "facultati_nume_prescurtat_facultate_key" ON "facultati"("nume_prescurtat_facultate");
