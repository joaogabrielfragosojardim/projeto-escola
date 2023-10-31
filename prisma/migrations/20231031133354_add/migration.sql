-- DropForeignKey
ALTER TABLE "administrator" DROP CONSTRAINT "administrator_userId_fkey";

-- DropForeignKey
ALTER TABLE "coordinator" DROP CONSTRAINT "coordinator_userId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_userId_fkey";

-- DropForeignKey
ALTER TABLE "teacher" DROP CONSTRAINT "teacher_userId_fkey";

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinator" ADD CONSTRAINT "coordinator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administrator" ADD CONSTRAINT "administrator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
