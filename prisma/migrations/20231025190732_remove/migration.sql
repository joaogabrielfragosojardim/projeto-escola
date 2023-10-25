/*
  Warnings:

  - You are about to drop the column `teacherId` on the `PegagogicalVisit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PegagogicalVisit" DROP CONSTRAINT "PegagogicalVisit_teacherId_fkey";

-- AlterTable
ALTER TABLE "PegagogicalVisit" DROP COLUMN "teacherId";
