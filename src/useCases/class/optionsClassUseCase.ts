import { prisma } from '@/lib/prisma';

interface OptionClassUseCaseRequest {
  schoolId?: string;
}

export class OptionsClassUseCase {
  async execute({ schoolId }: OptionClassUseCaseRequest) {
    const classRooms = await prisma.classroom.findMany({
      orderBy: {
        year: 'asc',
      },
      where: {
        schoolId: {
          equals: schoolId,
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
