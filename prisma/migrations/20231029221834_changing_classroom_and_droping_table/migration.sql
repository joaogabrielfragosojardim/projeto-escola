/*
  Warnings:

  - You are about to drop the column `session` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the `grade` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `period` to the `classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `classroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "classroom" DROP CONSTRAINT "classroom_gradeId_fkey";

-- AlterTable
ALTER TABLE "classroom" DROP COLUMN "session",
ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropTable
DROP TABLE "grade";
