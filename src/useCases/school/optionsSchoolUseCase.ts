import { prisma } from '@/lib/prisma';

interface OptionSchoolsUseCaseRequest {
  projectId?: string;
  projects?: string;
  userId: string;
}

export class OptionsSchoolUseCase {
  async execute({ projectId, userId, projects }: OptionSchoolsUseCaseRequest) {
    const projectsIds = JSON.parse(projects || '[]')?.map(
      (item: { value: string }) => item.value,
    );

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
          projectId:
            projectId || projectsIds.length
              ? {
                  in: projectId ? [projectId] : projectsIds,
                }
              : undefined,
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
        projectId:
          projectId || projectsIds.length
            ? {
                in: projectId ? [projectId] : projectsIds,
              }
            : undefined,
        Teacher: teacher?.id
          ? {
              some: {
                id: { equals: teacher?.id },
              },
            }
          : undefined,
        coordinators: coordinator?.id
          ? {
              some: {
                coordinatorId: { equals: coordinator?.id },
              },
            }
          : undefined,
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
