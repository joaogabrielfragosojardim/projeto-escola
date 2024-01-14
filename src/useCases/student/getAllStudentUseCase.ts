import { prisma } from '@/lib/prisma';
import { toStudents } from '@/utils/studentAdapter';

interface GetAllStudentUseCaseRequest {
  perPage: number;
  page: number;
  projectId?: string;
  year?: string;
  period?: string;
  schoolId?: string;
  teacherId?: string;
  coordinatorId?: string;
  classId?: string;
  name?: string;
  status?: string;
  userId: string;
}

export class GetAllStudentUseCase {
  async execute({
    page,
    perPage,
    year,
    period,
    projectId,
    schoolId,
    teacherId,
    coordinatorId,
    classId,
    name,
    status,
    userId,
  }: GetAllStudentUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const teacher = await prisma.teacher.findFirst({
      where: {
        userId,
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

    const [student, total] = await prisma.$transaction([
      prisma.student.findMany({
        skip,
        take,
        orderBy: [
          {
            school: {
              project: {
                name: 'desc',
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
          school: {
            projectId: { equals: projectId },
            coordinators: {
              some: {
                coordinatorId: { equals: coordinatorId },
              },
            },
          },
          Classroom: {
            id: { equals: classId },
            teachers:
              teacherId || teacher?.id
                ? {
                    some: {
                      id: { equals: teacherId || teacher?.id },
                    },
                  }
                : undefined,
            year: { equals: year },
            period: { equals: period },
          },
          user: {
            name: { contains: name, mode: 'insensitive' },
          },
        },
        select: {
          id: true,
          status: true,
          birtday: true,
          registration: true,
          user: {
            select: {
              visualIdentity: true,
              email: true,
              name: true,
            },
          },
          Classroom: {
            select: {
              period: true,
              year: true,
            },
          },
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
        },
      }),
      prisma.student.count({
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
          school: {
            projectId: { equals: projectId },
            coordinators: {
              some: {
                coordinatorId: { equals: coordinatorId },
              },
            },
          },
          Classroom: {
            id: { equals: classId },
            teachers:
              teacherId || teacher?.id
                ? {
                    some: {
                      id: { equals: teacherId || teacher?.id },
                    },
                  }
                : undefined,
            year: { equals: year },
            period: { equals: period },
          },
          user: {
            name: { contains: name, mode: 'insensitive' },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: toStudents(student),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
