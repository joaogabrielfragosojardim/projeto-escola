/*
  Warnings:

  - The primary key for the `CoordinatorToSchool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CoordinatorToSchool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CoordinatorToSchool" DROP CONSTRAINT "CoordinatorToSchool_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CoordinatorToSchool_pkey" PRIMARY KEY ("coordinatorId", "schoolId");
