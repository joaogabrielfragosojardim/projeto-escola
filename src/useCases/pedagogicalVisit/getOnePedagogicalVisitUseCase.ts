import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOnePedagogicalVisitUseCaseRequest {
  id: string | undefined;
}

export class GetOnePedagogicalVisitUseCase {
  async execute({ id }: GetOnePedagogicalVisitUseCaseRequest) {
    const pedagogicalVisit = await prisma.pedagogicalVisit.findUnique({
      where: {
        id,
      },
      include: {
        School: true,
        Classroom: {
          select: {
            id: true,
            createdAt: true,
            year: true,
            period: true,
            schoolId: true,
            teacherId: true,
            teacher: { select: { user: { select: { name: true } } } },
          },
        },
        Coordinator: { select: { user: { select: { name: true } } } },
      },
    });

    if (!pedagogicalVisit) {
      throw new AppError('Visita pedagógica não encontrada', 400);
    }

    return {
      pedagogicalVisit,
    };
  }
}
