import { prisma } from '@/lib/prisma';

interface DeleteCoordinatorUseCaseRequest {
  id: string | undefined;
}

export class DeleteCoordinatorUseCase {
  async execute({ id }: DeleteCoordinatorUseCaseRequest) {
    await prisma.coordinator.delete({
      where: { id },
    });
  }
}
