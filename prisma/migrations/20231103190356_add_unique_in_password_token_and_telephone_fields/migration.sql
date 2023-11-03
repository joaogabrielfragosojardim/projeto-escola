/*
  Warnings:

  - A unique constraint covering the columns `[telephone]` on the table `coordinator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telephone]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[passwordToken]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "coordinator_telephone_key" ON "coordinator"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_telephone_key" ON "teacher"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "user_passwordToken_key" ON "user"("passwordToken");
