import { prisma } from '@/lib/prisma';

interface OptionSchoolsUseCaseRequest {
  projectId?: string;
  coordinatorId?: string;
}

export class OptionsSchoolUseCase {
  async execute({ projectId, coordinatorId }: OptionSchoolsUseCaseRequest) {
    if (coordinatorId) {
      const coordinator = await prisma.coordinator.findFirst({
        where: { id: coordinatorId },
      });

      const school = await prisma.school.findFirst({
        where: { id: coordinator?.schoolId },
      });

      const options = [{ label: school?.name, value: school?.id }];

      return {
        options,
      };
    }

    const schools = await prisma.school.findMany({
      where: {
        projectId: {
          equals: projectId,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const options = schools.map((school) => ({
      label: school.name,
      value: school.id,
    }));

    return {
      options,
    };
  }
}
