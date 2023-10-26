/*
  Warnings:

  - You are about to drop the column `profileUrl` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "profileUrl",
ADD COLUMN     "visualIdentity" TEXT;
