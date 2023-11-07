import { prisma } from '@/lib/prisma';

interface OptionsTeacherUseCaseRequest {
  schoolId?: string;
  userId: string;
}

export class OptionsTeacherUseCase {
  async execute({ schoolId, userId }: OptionsTeacherUseCaseRequest) {
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
        schoolId: { equals: schoolId },
        coordinatorId: { equals: coordinator?.id },
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
