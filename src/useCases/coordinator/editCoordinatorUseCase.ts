import { prisma } from '@/lib/prisma';

interface EditCoordinatorUseCaseRequest {
  id: string | undefined;
  name: string;
  schoolId: string;
  telephone: string;
  visualIdentity?: string;
}

export class EditCoordinatorUseCase {
  async execute({
    id,
    schoolId,
    name,
    telephone,
    visualIdentity,
  }: EditCoordinatorUseCaseRequest) {
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
            id: true,
          },
        },
      },
    });

    const user = await prisma.user.update({
      where: { id: coordinator.user.id },
      data: {
        name,
        visualIdentity,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return {
      coordinator: {
        ...coordinator,
        ...user,
      },
    };
  }
}
