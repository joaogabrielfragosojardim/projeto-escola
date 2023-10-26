import { prisma } from '@/lib/prisma';

interface GetAllTeacherUseCaseRequest {
  perPage: number;
  page: number;
  userId: string;
}

export class GetAllTeacherUseCase {
  async execute({ userId, page, perPage }: GetAllTeacherUseCaseRequest) {
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

    const [teacher, total] = await prisma.$transaction([
      prisma.teacher.findMany({
        skip,
        take,
        where: {
          schoolId: coordinator?.schoolId,
        },
        orderBy: {
          createdAt: 'desc',
        },
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
