import { prisma } from '@/lib/prisma';
import { toTeachers } from '@/utils/teacherAdapter';

interface GetAllTeacherUseCaseRequest {
  perPage: number;
  page: number;
  userId: string;
  name?: string;
  schoolId?: string;
  projectId?: string;
  coordinatorId?: string;
  period?: string;
  year?: string;
  status?: string;
}

export class GetAllTeacherUseCase {
  async execute({
    userId,
    page,
    perPage,
    name,
    schoolId,
    projectId,
    coordinatorId,
    period,
    year,
    status,
  }: GetAllTeacherUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

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

    const [teachers, total] = await prisma.$transaction([
      prisma.teacher.findMany({
        skip,
        take,
        orderBy: [
          {
            school: {
              project: {
                name: 'asc',
              },
            },
          },
          {
            school: {
              name: 'asc',
            },
          },
          {
            user: {
              name: 'asc',
            },
          },
        ],
        where: {
          AND: [
            {
              schoolId: {
                equals: schoolId,
              },
            },
            {
              schoolId: {
                in: coordinator?.schools.map((school) => school.schoolId),
              },
            },
          ],
          status: {
            equals: status ? status === 'true' : undefined,
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
          coordinatorId: { equals: coordinatorId },
        },
        select: {
          status: true,
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
          status: {
            equals: status ? status === 'true' : undefined,
          },
          AND: [
            {
              schoolId: {
                equals: schoolId,
              },
            },
            {
              schoolId: {
                in: coordinator?.schools.map((school) => school.schoolId),
              },
            },
          ],
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
          coordinatorId: { equals: coordinatorId },
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
