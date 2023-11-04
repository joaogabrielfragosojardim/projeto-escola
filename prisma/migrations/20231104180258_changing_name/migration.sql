/*
  Warnings:

  - You are about to drop the `pegagogicalVisit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pegagogicalVisit" DROP CONSTRAINT "pegagogicalVisit_classId_fkey";

-- DropForeignKey
ALTER TABLE "pegagogicalVisit" DROP CONSTRAINT "pegagogicalVisit_coordinatorId_fkey";

-- DropForeignKey
ALTER TABLE "pegagogicalVisit" DROP CONSTRAINT "pegagogicalVisit_schoolId_fkey";

-- DropTable
DROP TABLE "pegagogicalVisit";

-- CreateTable
CREATE TABLE "pedagogicalVisit" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "frequency" INTEGER NOT NULL,
    "observations" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "schoolId" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "pedagogicalVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pedagogicalVisit" ADD CONSTRAINT "pedagogicalVisit_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedagogicalVisit" ADD CONSTRAINT "pedagogicalVisit_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedagogicalVisit" ADD CONSTRAINT "pedagogicalVisit_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
