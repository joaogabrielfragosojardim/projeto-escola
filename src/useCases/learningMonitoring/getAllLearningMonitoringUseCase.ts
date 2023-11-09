import { prisma } from '@/lib/prisma';

interface GetAllLearningMonitoringUseCaseRequest {
  perPage: number;
  page: number;
  startDate?: Date;
  finalDate?: Date;
  teacherId?: string;
  period?: string;
  year?: number;
  userId: string;
}

export class GetAllLearningMonitoringUseCase {
  async execute({
    page,
    perPage,
    teacherId,
    finalDate,
    startDate,
    year,
    period,
    userId,
  }: GetAllLearningMonitoringUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const teacher = await prisma.teacher.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const [learningMonitoring, total] = await prisma.$transaction([
      prisma.learningMonitoring.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: finalDate,
          },
          classroom: {
            teacherId: {
              equals: teacherId || teacher?.id,
            },
            period: {
              equals: period,
            },
            year: {
              equals: year,
            },
          },
        },
        select: {
          id: true,
          createdAt: true,
          student: { select: { id: true, user: { select: { name: true } } } },
          classroom: {
            select: {
              id: true,
              year: true,
              period: true,
              teacher: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        skip,
        take,
      }),
      prisma.learningMonitoring.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: finalDate,
          },
          classroom: {
            teacherId: {
              equals: teacherId,
            },
            period: {
              equals: period,
            },
            year: {
              equals: year,
            },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: learningMonitoring,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
