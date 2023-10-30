/*
  Warnings:

  - You are about to drop the column `gradeId` on the `classroom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "classroom" DROP CONSTRAINT "classroom_teacherId_fkey";

-- AlterTable
ALTER TABLE "classroom" DROP COLUMN "gradeId",
ALTER COLUMN "teacherId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
