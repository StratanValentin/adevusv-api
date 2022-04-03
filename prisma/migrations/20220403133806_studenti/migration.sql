/*
  Warnings:

  - Made the column `an` on table `studenti` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cnp` on table `studenti` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specializare` on table `studenti` required. This step will fail if there are existing NULL values in that column.
  - Made the column `taxa` on table `studenti` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grupa` on table `studenti` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "studenti" ALTER COLUMN "an" SET NOT NULL,
ALTER COLUMN "cnp" SET NOT NULL,
ALTER COLUMN "specializare" SET NOT NULL,
ALTER COLUMN "taxa" SET NOT NULL,
ALTER COLUMN "grupa" SET NOT NULL;
