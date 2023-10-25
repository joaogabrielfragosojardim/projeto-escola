/*
  Warnings:

  - You are about to drop the column `indicators` on the `PegagogicalVisit` table. All the data in the column will be lost.
  - You are about to drop the column `session` on the `PegagogicalVisit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PegagogicalVisit" DROP COLUMN "indicators",
DROP COLUMN "session";
