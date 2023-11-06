import { prisma } from '@/lib/prisma';
import { toPedagogicalVisits } from '@/utils/pedagogicalVisitAdapter';

interface GetAllPedagogicalVisitUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
}

export class GetAllPedagogicalVisitsUseCase {
  async execute({ page, perPage }: GetAllPedagogicalVisitUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [pedagogicalVisit, total] = await prisma.$transaction([
      prisma.pedagogicalVisit.findMany({
        orderBy: {
          date: 'desc',
        },
        select: {
          date: true,
          id: true,
          Classroom: {
            select: {
              teacher: {
                select: {
                  user: true,
                },
              },
              year: true,
              period: true,
              id: true,
            },
          },
          Coordinator: {
            select: {
              user: true,
            },
          },
        },
        skip,
        take,
      }),
      prisma.pedagogicalVisit.count({}),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: toPedagogicalVisits(pedagogicalVisit),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
