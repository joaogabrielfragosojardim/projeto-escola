import { prisma } from '@/lib/prisma';

interface GetAllStudentUseCaseRequest {
  perPage: number;
  page: number;
}

export class GetAllStudentUseCase {
  async execute({ page, perPage }: GetAllStudentUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [student, total] = await prisma.$transaction([
      prisma.student.findMany({
        skip,
        take,
        select: {
          id: true,
          birtday: true,
          schoolId: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.teacher.count(),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: student,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
