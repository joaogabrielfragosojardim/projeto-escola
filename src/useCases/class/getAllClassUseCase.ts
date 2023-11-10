import { prisma } from '@/lib/prisma';

interface GetAllClassUseCaseRequest {
  perPage: number;
  page: number;
  schoolId?: string;
  gradeId?: string;
  teacherId?: string;
  studentId?: string;
}

export class GetAllClassUseCase {
  async execute({
    page,
    perPage,
    schoolId,
    teacherId,
    studentId,
  }: GetAllClassUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [classrooms, total] = await prisma.$transaction([
      prisma.classroom.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          students: {
            some: { id: studentId },
          },
          schoolId: { equals: schoolId },
          teacherId: { equals: teacherId },
        },
        select: {
          id: true,
          school: {
            select: {
              id: true,
              name: true,
            },
          },
          teacher: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          students: {
            select: {
              id: true,
              birtday: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.classroom.count(),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: classrooms,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
