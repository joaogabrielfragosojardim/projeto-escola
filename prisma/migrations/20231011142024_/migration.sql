/*
  Warnings:

  - You are about to drop the column `validated` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "validated";

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false;
