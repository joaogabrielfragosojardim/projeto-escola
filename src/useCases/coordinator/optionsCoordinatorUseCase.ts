import { prisma } from '@/lib/prisma';

interface OptionCoordinatorUseCaseRequest {
  schoolId?: string;
  projectId?: string;
}

export class OptionsCoordinatorUseCase {
  async execute({ schoolId, projectId }: OptionCoordinatorUseCaseRequest) {
    const coordinators = await prisma.coordinator.findMany({
      where: {
        schools: {
          some: {
            schoolId: { equals: schoolId },
            school: {
              projectId: {
                equals: projectId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const options = coordinators.map((coordinator) => ({
      label: coordinator.user.name,
      value: coordinator.id,
    }));

    return {
      options,
    };
  }
}
