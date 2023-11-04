-- CreateTable
CREATE TABLE "learningMonitoring" (
    "id" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "writingLevel" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "learningMonitoring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "learningMonitoring" ADD CONSTRAINT "learningMonitoring_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learningMonitoring" ADD CONSTRAINT "learningMonitoring_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learningMonitoring" ADD CONSTRAINT "learningMonitoring_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
