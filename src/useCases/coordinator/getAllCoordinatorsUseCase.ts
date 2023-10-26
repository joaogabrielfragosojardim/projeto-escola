import { prisma } from '@/lib/prisma';
import { toCoordinators } from '@/utils/coordinatorAdapter';

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
          user: {
            select: {
              email: true,
              name: true,
              visualIdentity: true,
            },
          },
        },
      }),
      prisma.coordinator.count(),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: toCoordinators(coordinators),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
