import { prisma } from '@/lib/prisma';

interface GetAllCoordinatorsUseCaseRequest {
  perPage: number;
  page: number;
}

export class GetAllCoordinatorsUseCase {
  async execute({ page, perPage }: GetAllCoordinatorsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [coordinators, total] = await prisma.$transaction([
      prisma.coordinator.findMany({
        skip,
        take,
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
      prisma.coordinator.count(),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: coordinators,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
