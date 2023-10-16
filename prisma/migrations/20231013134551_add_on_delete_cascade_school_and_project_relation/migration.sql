-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_projectId_fkey";

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
