-- CreateTable
CREATE TABLE "PegagogicalVisit" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session" TEXT NOT NULL,
    "indicators" TEXT NOT NULL,
    "frequecy" INTEGER NOT NULL,
    "observations" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "schoolId" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "PegagogicalVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PegagogicalVisit" ADD CONSTRAINT "PegagogicalVisit_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PegagogicalVisit" ADD CONSTRAINT "PegagogicalVisit_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PegagogicalVisit" ADD CONSTRAINT "PegagogicalVisit_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "Coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PegagogicalVisit" ADD CONSTRAINT "PegagogicalVisit_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
