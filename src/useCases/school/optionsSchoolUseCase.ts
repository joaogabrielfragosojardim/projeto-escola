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

    const schools = await prisma.school.findMany({
      where: {
        projectId: {
          equals: projectId,
        },
        Teacher: {
          some: {
            id: teacher?.id,
          },
        },
        Coordinator: {
          some: {
            id: coordinator?.id,
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
