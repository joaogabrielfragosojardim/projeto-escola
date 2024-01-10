import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface DeleteCoordinatorUseCaseRequest {
  id: string | undefined;
}

export class DeleteCoordinatorUseCase {
  async execute({ id }: DeleteCoordinatorUseCaseRequest) {
    const coordinator = await prisma.coordinator.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!coordinator) {
      throw new AppError('Usuário inexistente', 400);
    }

    await prisma.coordinator.delete({
      where: { id },
    });

    await prisma.user.delete({
      where: { id: coordinator.userId },
    });

    await prisma.coordinatorToSchool.deleteMany({
      where: {
        coordinatorId: id,
      },
    });
  }
}
