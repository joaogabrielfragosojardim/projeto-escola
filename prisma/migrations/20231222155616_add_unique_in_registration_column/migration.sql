/*
  Warnings:

  - A unique constraint covering the columns `[registration]` on the table `student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_registration_key" ON "student"("registration");
