/*
  Warnings:

  - You are about to drop the column `schoolId` on the `coordinator` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "coordinator" DROP CONSTRAINT "coordinator_schoolId_fkey";

-- AlterTable
ALTER TABLE "coordinator" DROP COLUMN "schoolId";

-- CreateTable
CREATE TABLE "CoordinatorToSchool" (
    "id" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "CoordinatorToSchool_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoordinatorToSchool" ADD CONSTRAINT "CoordinatorToSchool_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoordinatorToSchool" ADD CONSTRAINT "CoordinatorToSchool_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
