import { prisma } from '@/lib/prisma';

interface GetAllClassUseCaseRequest {
  perPage: number;
  page: number;
  schoolId?: string;
  gradeId?: string;
  teacherId?: string;
}

export class GetAllClassUseCase {
  async execute({
    page,
    perPage,
    schoolId,
    gradeId,
    teacherId,
  }: GetAllClassUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [schools, total] = await prisma.$transaction([
      prisma.class.findMany({
        skip,
        take,
        where: {
          schoolId: { equals: schoolId },
          gradeId: { equals: gradeId },
          teacherId: { equals: teacherId },
        },
        select: {
          id: true,
          name: true,
          session: true,
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
          grade: {
            select: {
              id: true,
              name: true,
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
      prisma.class.count(),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: schools,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
