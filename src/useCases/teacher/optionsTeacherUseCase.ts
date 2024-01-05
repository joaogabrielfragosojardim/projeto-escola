import { prisma } from '@/lib/prisma';

interface OptionsTeacherUseCaseRequest {
  projectId?: string;
  schoolId?: string;
  coordinatorId?: string;
  userId: string;
}

export class OptionsTeacherUseCase {
  async execute({
    projectId,
    schoolId,
    userId,
    coordinatorId,
  }: OptionsTeacherUseCaseRequest) {
    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId,
      },
    });

    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      where: {
        school: {
          projectId: { equals: projectId },
        },
        schoolId: { equals: schoolId },
        coordinatorId: { equals: coordinator?.id || coordinatorId },
      },
    });

    const options = teachers.map((teacher) => ({
      label: teacher.user.name,
      value: teacher.id,
    }));

    return {
      options,
    };
  }
}
