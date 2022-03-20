/*
  Warnings:

  - Added the required column `html` to the `procesare_documente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_facultate` to the `procesare_documente` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "procesare_documente" DROP CONSTRAINT "procesare_documente_id_document_fkey";

-- AlterTable
ALTER TABLE "procesare_documente" ADD COLUMN     "html" TEXT NOT NULL,
ADD COLUMN     "id_facultate" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "procesare_documente" ADD CONSTRAINT "procesare_documente_id_facultate_fkey" FOREIGN KEY ("id_facultate") REFERENCES "facultati"("id_facultate") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procesare_documente" ADD CONSTRAINT "procesare_documente_id_document_fkey" FOREIGN KEY ("id_document") REFERENCES "documente"("id_document") ON DELETE RESTRICT ON UPDATE CASCADE;
