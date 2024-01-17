import { prisma } from '@/lib/prisma';

interface ChangeCoordinatorStatusUseCaseRequest {
  schoolId: string;
  status: boolean;
}

export class ChangeCoordinatorStatusUseCase {
  async execute({ schoolId, status }: ChangeCoordinatorStatusUseCaseRequest) {
    const coordinator = await prisma.school.update({
      where: { id: schoolId },
      data: {
        status,
      },
    });

    return {
      coordinator,
    };
  }
}
