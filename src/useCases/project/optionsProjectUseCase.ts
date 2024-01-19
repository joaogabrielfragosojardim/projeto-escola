import { prisma } from '@/lib/prisma';

export class OptionsProjectUseCase {
  async execute({ userId }: { userId: string }) {
    const coordinator = await prisma.coordinator.findFirst({
      where: { userId },
      select: { schools: { select: { schoolId: true } } },
    });

    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
      },
      where: coordinator?.schools.length
        ? {
            Schools: {
              some: {
                id: {
                  in: coordinator.schools.map((school) => school.schoolId),
                },
              },
            },
          }
        : undefined,
    });

    const options = projects.map((project) => ({
      label: project.name,
      value: project.id,
    }));

    return {
      options,
    };
  }
}
