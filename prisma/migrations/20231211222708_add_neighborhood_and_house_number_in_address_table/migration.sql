/*
  Warnings:

  - Added the required column `houseNumber` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "houseNumber" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL;
