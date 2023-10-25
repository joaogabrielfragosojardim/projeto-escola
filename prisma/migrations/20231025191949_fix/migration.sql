/*
  Warnings:

  - You are about to drop the column `frequecy` on the `PegagogicalVisit` table. All the data in the column will be lost.
  - Added the required column `frequency` to the `PegagogicalVisit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PegagogicalVisit" DROP COLUMN "frequecy",
ADD COLUMN     "frequency" INTEGER NOT NULL;
