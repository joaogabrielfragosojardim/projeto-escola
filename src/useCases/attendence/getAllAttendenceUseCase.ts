import { prisma } from '@/lib/prisma';

interface GetAllAttendenceUseCaseRequest {
  perPage: number;
  page: number;
  startDate?: Date;
  finalDate?: Date;
  teacherId?: string;
  studentId?: string;
  period?: string;
  year?: number;
  userId: string;
}

export class GetAllAttendenceUseCase {
  async execute({
    page,
    perPage,
    teacherId,
    studentId,
    finalDate,
    startDate,
    year,
    period,
    userId,
  }: GetAllAttendenceUseCaseRequest) {
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

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId,
      },
      select: {
        schoolId: true,
      },
    });

    const [attendance, total] = await prisma.$transaction([
      prisma.attendance.findMany({
        orderBy: {
          date: 'desc',
        },
        where: {
          date: {
            gte: startDate,
            lte: finalDate,
          },
          Classroom: {
            schoolId: { equals: coordinator?.schoolId },
            students: {
              some: {
                id: studentId,
              },
            },
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
          date: true,
          isPresent: true,
          student: { select: { id: true, user: { select: { name: true } } } },
          Classroom: {
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
      prisma.attendance.count({
        where: {
          date: {
            gte: startDate,
            lte: finalDate,
          },
          Classroom: {
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
      data: attendance,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
