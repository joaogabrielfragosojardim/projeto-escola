/*
  Warnings:

  - You are about to drop the column `registration` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Student_registration_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "registration";
