import { prisma } from '@/lib/prisma';

interface GetAllLearningMonitoringUseCaseRequest {
  perPage: number;
  page: number;
  startDate?: Date;
  finalDate?: Date;
  teacherId?: string;
  studentId?: string;
  schoolId?: string;
  coordinatorId?: string;
  projectId?: string;
  period?: string;
  year?: string;
  userId: string;
}

export class GetAllLearningMonitoringUseCase {
  async execute({
    page,
    perPage,
    teacherId,
    coordinatorId,
    projectId,
    finalDate,
    startDate,
    studentId,
    year,
    period,
    userId,
    schoolId,
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

    const coordinator = await prisma.coordinator.findFirst({
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
            schoolId: { equals: schoolId },
            school: {
              projectId: {
                equals: projectId,
              },
              coordinators: {
                some: {
                  coordinatorId: { equals: coordinatorId || coordinator?.id },
                },
              },
            },
            period: {
              equals: period,
            },
            year: {
              equals: year,
            },
          },
          teacher: { id: { equals: teacherId || teacher?.id } },
          studentId: { equals: studentId },
        },
        select: {
          id: true,
          createdAt: true,
          questions: true,
          writingLevel: true,
          student: {
            select: {
              id: true,
              registration: true,
              user: { select: { name: true } },
            },
          },
          classroom: {
            select: {
              id: true,
              year: true,
              period: true,
            },
          },
          teacher: {
            select: { id: true, user: { select: { name: true } } },
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
            schoolId: { equals: schoolId },
            school: {
              projectId: {
                equals: projectId,
              },
              coordinators: {
                some: {
                  coordinatorId: { equals: coordinatorId || coordinator?.id },
                },
              },
            },
            period: {
              equals: period,
            },
            year: {
              equals: year,
            },
          },
          teacher: { id: { equals: teacherId || teacher?.id } },
          studentId: { equals: studentId },
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
