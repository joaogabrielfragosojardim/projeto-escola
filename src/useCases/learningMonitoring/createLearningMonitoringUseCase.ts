import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateLearningMonitoringUseCaseRequest {
  writingLevel: string;
  questions: Record<string, string>;
  studentId: string;
  teacherId: string;
  date: Date;
}

export class CreateLearningMonitoringUseCase {
  async execute({
    date,
    questions,
    writingLevel,
    studentId,
    teacherId,
  }: CreateLearningMonitoringUseCaseRequest) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        schoolId: true,
        classId: true,
      },
    });

    const teacher = await prisma.teacher.findFirst({
      where: { userId: { equals: teacherId } },
    });

    const classroomHaveTeacher = await prisma.classroom.findFirst({
      where: {
        teachers: { some: { id: teacher?.id } },
      },
    });

    if (!teacher) {
      throw new AppError('Educador Social não encontrado', 400);
    }

    if (!student) {
      throw new AppError('Estudante não encontrado', 400);
    }

    if (!classroomHaveTeacher) {
      throw new AppError('Turma sem Educador Social', 400);
    }

    const learningMonitoring = await prisma.learningMonitoring.create({
      data: {
        createdAt: date,
        questions,
        classroomId: student.classId,
        teacherId: teacher?.id,
        studentId: student.id,
        writingLevel,
      },
    });

    return {
      learningMonitoring,
    };
  }
}
