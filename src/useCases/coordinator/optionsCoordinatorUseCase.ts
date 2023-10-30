import { prisma } from '@/lib/prisma';

export class OptionsCoordinatorUseCase {
  async execute() {
    const coordinators = await prisma.coordinator.findMany({
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
