import { prisma } from '@/lib/prisma';

interface EditCoordinatorUseCaseRequest {
  id: string | undefined;
  schoolId: string;
  telephone: string;
}

export class EditCoordinatorUseCase {
  async execute({ id, schoolId, telephone }: EditCoordinatorUseCaseRequest) {
    const coordinator = await prisma.coordinator.update({
      where: { id },
      data: {
        schoolId,
        telephone,
      },
      select: {
        id: true,
        telephone: true,
        schoolId: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      coordinator,
    };
  }
}
