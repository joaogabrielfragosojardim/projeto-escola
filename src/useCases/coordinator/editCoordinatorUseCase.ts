import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface EditCoordinatorUseCaseRequest {
  id: string | undefined;
  name: string;
  schoolIds: string[];
  telephone: string;
  visualIdentity?: string;
}

export class EditCoordinatorUseCase {
  async execute({
    id,
    schoolIds,
    name,
    telephone,
    visualIdentity,
  }: EditCoordinatorUseCaseRequest) {
    if (!id) {
      throw new AppError('Coordenador não encontrado', 400);
    }

    const coordinator = await prisma.coordinator.update({
      where: { id },
      data: {
        telephone,
      },
      select: {
        id: true,
        telephone: true,
        schools: {
          select: {
            schoolId: true,
          },
        },
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

    const newSchools = schoolIds.map((school) => ({
      coordinatorId: id,
      schoolId: school,
    }));

    await prisma.coordinatorToSchool.deleteMany({
      where: {
        coordinatorId: id,
      },
    });

    const updatedSchools = await prisma.coordinatorToSchool.createMany({
      data: newSchools,
    });

    return {
      coordinator: {
        ...coordinator,
        schools: updatedSchools,
        ...user,
      },
    };
  }
}
