import { prisma } from '@/lib/prisma';
import { toStudents } from '@/utils/studentAdapter';

interface GetAllStudentUseCaseRequest {
  perPage: number;
  page: number;
  projectId?: string;
  year?: number;
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
        ],
        where: {
          status: {
            equals: status ? status === 'true' : undefined,
          },
          schoolId: { equals: schoolId || coordinator?.schoolId },
          school: {
            projectId: { equals: projectId },
            Coordinator: {
              every: {
                id: { equals: coordinatorId },
              },
            },
          },
          Classroom: {
            id: { equals: classId },
            teacherId: { equals: teacherId || teacher?.id },
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
          schoolId: { equals: schoolId },
          school: {
            projectId: { equals: projectId },
          },
          Classroom: {
            teacherId: { equals: teacherId },
            year: { equals: year },
            period: { equals: period },
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
