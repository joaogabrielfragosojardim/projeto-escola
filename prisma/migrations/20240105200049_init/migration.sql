-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "visualIdentity" TEXT,
    "password" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isFirstAccess" BOOLEAN NOT NULL DEFAULT true,
    "passwordToken" TEXT,
    "passwordExpiresDate" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "visualIdentity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "visualIdentity" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "birtday" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "registration" TEXT NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "schoolId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "coordinator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroom" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT false,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedagogicalVisit" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "frequency" INTEGER NOT NULL,
    "observations" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "schoolId" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "pedagogicalVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "administrator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learningMonitoring" (
    "id" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "writingLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "studentId" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "learningMonitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassroomToTeacher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_passwordToken_key" ON "user"("passwordToken");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "school_addressId_key" ON "school"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "student_registration_key" ON "student"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_telephone_key" ON "teacher"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "coordinator_telephone_key" ON "coordinator"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassroomToTeacher_AB_unique" ON "_ClassroomToTeacher"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassroomToTeacher_B_index" ON "_ClassroomToTeacher"("B");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school" ADD CONSTRAINT "school_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school" ADD CONSTRAINT "school_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinator" ADD CONSTRAINT "coordinator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinator" ADD CONSTRAINT "coordinator_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedagogicalVisit" ADD CONSTRAINT "pedagogicalVisit_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedagogicalVisit" ADD CONSTRAINT "pedagogicalVisit_coordinatorId_fkey" FOREIGN KEY ("coordinatorId") REFERENCES "coordinator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedagogicalVisit" ADD CONSTRAINT "pedagogicalVisit_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administrator" ADD CONSTRAINT "administrator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learningMonitoring" ADD CONSTRAINT "learningMonitoring_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learningMonitoring" ADD CONSTRAINT "learningMonitoring_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learningMonitoring" ADD CONSTRAINT "learningMonitoring_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToTeacher" ADD CONSTRAINT "_ClassroomToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassroomToTeacher" ADD CONSTRAINT "_ClassroomToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
