-- AlterTable
ALTER TABLE "user" ADD COLUMN     "passwordExpiresDate" TIMESTAMP(3),
ADD COLUMN     "passwordToken" TEXT;
