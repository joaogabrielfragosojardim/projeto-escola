import { prisma } from '@/lib/prisma';

interface GetAllTeacherUseCaseRequest {
  perPage: number;
  page: number;
}

export class GetAllTeacherUseCase {
  async execute({ page, perPage }: GetAllTeacherUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [teacher, total] = await prisma.$transaction([
      prisma.teacher.findMany({
        skip,
        take,
        select: {
          id: true,
          telephone: true,
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
      data: teacher,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
