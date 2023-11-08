import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface DeletePedagogicalVisitUseCaseRequest {
  id: string | undefined;
}

export class DeletePedagogicalVisitUseCase {
  async execute({ id }: DeletePedagogicalVisitUseCaseRequest) {
    const pedagogicalVisit = await prisma.pedagogicalVisit.findUnique({
      where: { id },
    });

    if (!pedagogicalVisit) {
      throw new AppError('Visita pedagógica não inexistente', 400);
    }

    await prisma.pedagogicalVisit.delete({
      where: { id },
    });
  }
}
