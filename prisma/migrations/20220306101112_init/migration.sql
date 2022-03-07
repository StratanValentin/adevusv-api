/*
  Warnings:

  - Added the required column `cuvinte_rezervate` to the `procesare_documente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "procesare_documente" ADD COLUMN     "cuvinte_rezervate" JSONB NOT NULL;
