import { prisma } from '@/lib/prisma';

interface OptionClassUseCaseRequest {
  schoolId?: string;
  userId: string;
}

export class OptionsClassUseCase {
  async execute({ schoolId, userId }: OptionClassUseCaseRequest) {
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const classRooms = await prisma.classroom.findMany({
      orderBy: {
        year: 'asc',
      },
      where: {
        schoolId: {
          equals: schoolId,
        },
        teacherId: {
          equals: teacher?.id,
        },
      },
      select: {
        id: true,
        period: true,
        year: true,
      },
    });

    const options = classRooms.map((classroom) => ({
      label: `${classroom.year}º ano - ${classroom.period}`,
      value: classroom.id,
    }));

    return {
      options,
    };
  }
}
