-- CreateTable
CREATE TABLE "procesare_documente" (
    "id_procesare" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "id_document" INTEGER NOT NULL,
    "id_student" INTEGER NOT NULL,

    CONSTRAINT "procesare_documente_pkey" PRIMARY KEY ("id_procesare")
);

-- AddForeignKey
ALTER TABLE "procesare_documente" ADD CONSTRAINT "procesare_documente_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "studenti"("id_student") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesare_documente" ADD CONSTRAINT "procesare_documente_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "documente"("id_document") ON DELETE CASCADE ON UPDATE CASCADE;
