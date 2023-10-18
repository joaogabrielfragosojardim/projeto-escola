import { prisma } from '@/lib/prisma';

interface OptionsTeacherUseCaseRequest {
  schoolId?: string;
}

export class OptionsTeacherUseCase {
  async execute({ schoolId }: OptionsTeacherUseCaseRequest) {
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
