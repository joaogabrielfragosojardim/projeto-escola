import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOnePegagogicalVisitUseCaseRequest {
  id: string | undefined;
}

export class GetOnePegagogicalVisitUseCase {
  async execute({ id }: GetOnePegagogicalVisitUseCaseRequest) {
    const pegagogicalVisit = await prisma.pegagogicalVisit.findUnique({
      where: {
        id,
      },
      include: {
        School: true,
        Classroom: true,
        Coodinator: true,
      },
    });

    if (!pegagogicalVisit) {
      throw new AppError('Visita pedagógica não encontrada', 400);
    }

    return {
      pegagogicalVisit,
    };
  }
}
