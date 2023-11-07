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
        questions: true,
        writingLevel: true,
        student: {
          select: {
            id: true,
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
      },
    });

    if (!learningMonitoring) {
      throw new AppError('Acompanhamento não encontrado', 400);
    }

    return {
      learningMonitoring: {
        id: learningMonitoring.id,
        questions: learningMonitoring.questions,
        writingLevel: learningMonitoring.writingLevel,
        student: {
          id: learningMonitoring.student.id,
          name: learningMonitoring.student.user.name,
        },
        classroom: {
          id: learningMonitoring.classroom.id,
          period: learningMonitoring.classroom.period,
          year: learningMonitoring.classroom.year,
        },
      },
    };
  }
}
