import { prisma } from '@/lib/prisma';

interface GetAllAttendenceUseCaseRequest {
  perPage: number;
  page: number;
  startDate?: Date;
  finalDate?: Date;
  teacherId?: string;
  studentId?: string;
  projectId?: string;
  period?: string;
  year?: string;
  userId: string;
}

export class GetAllAttendenceUseCase {
  async execute({
    page,
    perPage,
    teacherId,
    studentId,
    projectId,
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
        schools: {
          select: {
            schoolId: true,
          },
        },
      },
    });

    const coordinatorSchoolIds =
      coordinator?.schools.map((school) => school.schoolId) || [];

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
            school: {
              projectId: { equals: projectId },
            },
            schoolId: { in: coordinatorSchoolIds },
            students: {
              some: {
                id: studentId,
              },
            },
            period: {
              equals: period,
            },
            year: {
              equals: year,
            },
          },
          Teacher: { id: { equals: teacherId || teacher?.id } },
        },
        select: {
          id: true,
          date: true,
          isPresent: true,
          student: {
            select: {
              id: true,
              registration: true,
              user: { select: { name: true } },
            },
          },
          Classroom: {
            select: {
              id: true,
              year: true,
              period: true,
              teachers: {
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
          Teacher: { select: { id: true, user: { select: { name: true } } } },
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
            teachers:
              teacherId || teacher?.id
                ? { some: { id: { equals: teacherId || teacher?.id } } }
                : undefined,
            period: {
              equals: period,
            },
            year: {
              equals: year,
            },
          },
          Teacher: { id: { equals: teacherId || teacher?.id } },
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
