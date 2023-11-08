import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreatePedagogicalVisitUseCaseRequest {
  writingLevel: string;
  questions: Record<string, string>;
  studentId: string;
}

export class CreateLearningMonitoringUseCase {
  async execute({
    questions,
    writingLevel,
    studentId,
  }: CreatePedagogicalVisitUseCaseRequest) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        schoolId: true,
        classId: true,
        Classroom: {
          select: {
            teacherId: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError('Estudante não encontrado', 400);
    }

    if (!student.Classroom.teacherId) {
      throw new AppError('Turma sem Educador Social', 400);
    }

    const learningMonitoring = await prisma.learningMonitoring.create({
      data: {
        questions,
        classroomId: student.classId,
        teacherId: student.Classroom.teacherId,
        studentId: student.id,
        writingLevel,
      },
    });

    return {
      learningMonitoring,
    };
  }
}
