import { prisma } from '@/lib/prisma';

interface ChangeCoordinatorStatusUseCaseRequest {
  coordinatorId: string;
  status: boolean;
}

export class ChangeCoordinatorStatusUseCase {
  async execute({
    coordinatorId,
    status,
  }: ChangeCoordinatorStatusUseCaseRequest) {
    const coordinator = await prisma.coordinator.update({
      where: { id: coordinatorId },
      data: {
        status,
      },
    });

    return {
      coordinator,
    };
  }
}
