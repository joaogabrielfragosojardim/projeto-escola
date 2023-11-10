import { prisma } from '@/lib/prisma';

interface OptionSchoolsUseCaseRequest {
  projectId?: string;
  userId: string;
}

export class OptionsSchoolUseCase {
  async execute({ projectId, userId }: OptionSchoolsUseCaseRequest) {
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!teacher && !coordinator) {
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

    const schools = await prisma.school.findMany({
      where: {
        projectId: {
          equals: projectId,
        },
        Teacher: {
          some: {
            id: { equals: teacher?.id },
          },
        },
        Coordinator: {
          some: {
            id: { equals: coordinator?.id },
          },
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
