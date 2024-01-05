-- AlterTable
ALTER TABLE "coordinator" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "school" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
