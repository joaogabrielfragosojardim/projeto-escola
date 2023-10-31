import { prisma } from '@/lib/prisma';
import { toTeachers } from '@/utils/teacherAdapter';

interface GetAllTeacherUseCaseRequest {
  perPage: number;
  page: number;
  userId: string;
  name?: string;
  schoolId?: string;
  projectId?: string;
  period?: string;
  year?: number;
}

export class GetAllTeacherUseCase {
  async execute({
    userId,
    page,
    perPage,
    name,
    schoolId,
    projectId,
    period,
    year,
  }: GetAllTeacherUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });

    // const role = await prisma.role.findUnique({
    //   where: { id: user?.roleId },
    // });

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId,
      },
    });

    const [teachers, total] = await prisma.$transaction([
      prisma.teacher.findMany({
        skip,
        take,
        where: {
          schoolId: {
            equals: coordinator?.schoolId || schoolId,
          },
          user: {
            name: { contains: name, mode: 'insensitive' },
          },
          school: {
            projectId: {
              equals: projectId,
            },
          },
          Classroom: {
            some: {
              schoolId: {
                equals: schoolId,
              },
              period: {
                equals: period,
              },
              year: {
                equals: year,
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          telephone: true,
          school: {
            select: {
              id: true,
              name: true,
              project: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          Classroom: {
            select: {
              id: true,
              period: true,
              year: true,
            },
          },
          user: {
            select: {
              email: true,
              name: true,
              visualIdentity: true,
            },
          },
        },
      }),
      prisma.teacher.count({
        where: {
          schoolId: {
            equals: coordinator?.schoolId || schoolId,
          },
          user: {
            name: {
              equals: name,
            },
          },
          school: {
            projectId: {
              equals: projectId,
            },
          },
          Classroom: {
            every: {
              schoolId: {
                equals: schoolId,
              },
              period: {
                equals: period,
              },
              year: {
                equals: year,
              },
            },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: toTeachers(teachers),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
