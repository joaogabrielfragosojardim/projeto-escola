import { prisma } from '@/lib/prisma';
import { toPedagogicalVisits } from '@/utils/pedagogicalVisitAdapter';

interface GetAllPedagogicalVisitUseCaseRequest {
  perPage: number;
  page: number;
  startDate?: Date;
  finalDate?: Date;
  coordinatorId?: string;
  teacherId?: string;
  period?: string;
  year?: number;
}

export class GetAllPedagogicalVisitsUseCase {
  async execute({
    page,
    perPage,
    coordinatorId,
    teacherId,
    finalDate,
    startDate,
    year,
    period,
  }: GetAllPedagogicalVisitUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [pedagogicalVisit, total] = await prisma.$transaction([
      prisma.pedagogicalVisit.findMany({
        orderBy: {
          date: 'desc',
        },
        where: {
          date: {
            gte: startDate,
            lte: finalDate,
          },
          coordinatorId: {
            equals: coordinatorId,
          },
          Classroom: {
            teacherId: {
              equals: teacherId,
            },
            period: {
              equals: period,
            },
            year: {
              equals: year,
            },
          },
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
