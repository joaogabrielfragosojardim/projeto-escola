import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneLearningMonitogingRequest {
  id?: string;
}

export class GetOneLearningMonitogingUseCase {
  async execute({ id }: GetOneLearningMonitogingRequest) {
    const learningMonitoring = await prisma.learningMonitoring.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        createdAt: true,
        questions: true,
        writingLevel: true,
        student: {
          select: {
            id: true,
            registration: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        classroom: {
          select: {
            id: true,
            period: true,
            year: true,
          },
        },
        teacher: { select: { id: true, user: { select: { name: true } } } },
      },
    });

    if (!learningMonitoring) {
      throw new AppError('Acompanhamento não encontrado', 400);
    }

    return {
      learningMonitoring: {
        id: learningMonitoring.id,
        createdAt: learningMonitoring.createdAt,
        questions: learningMonitoring.questions,
        writingLevel: learningMonitoring.writingLevel,
        student: {
          id: learningMonitoring.student.id,
          name: learningMonitoring.student.user.name,
          registration: learningMonitoring.student.registration,
        },
        classroom: {
          id: learningMonitoring.classroom.id,
          period: learningMonitoring.classroom.period,
          year: learningMonitoring.classroom.year,
        },
        teacher: {
          id: learningMonitoring.teacher?.id,
          user: { name: learningMonitoring.teacher?.user.name },
        },
      },
    };
  }
}
