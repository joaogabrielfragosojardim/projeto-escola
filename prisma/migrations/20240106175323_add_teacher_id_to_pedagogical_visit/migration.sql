/*
  Warnings:

  - Added the required column `teacherId` to the `pedagogicalVisit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pedagogicalVisit" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "pedagogicalVisit" ADD CONSTRAINT "pedagogicalVisit_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
