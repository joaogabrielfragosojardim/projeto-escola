import { prisma } from '@/lib/prisma';
import { toCoordinators } from '@/utils/coordinatorAdapter';

interface GetAllCoordinatorsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
  projectId?: string;
  schoolId?: string;
}

export class GetAllCoordinatorsUseCase {
  async execute({
    page,
    perPage,
    name,
    schoolId,
    projectId,
  }: GetAllCoordinatorsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [coordinators, total] = await prisma.$transaction([
      prisma.coordinator.findMany({
        skip,
        take,
        orderBy: [
          {
            school: {
              project: {
                name: 'asc',
              },
            },
          },
          {
            school: {
              name: 'asc',
            },
          },
          {
            user: {
              name: 'asc',
            },
          },
        ],
        where: {
          user: {
            name: { contains: name, mode: 'insensitive' },
          },
          schoolId: { equals: schoolId },
          school: {
            projectId: { equals: projectId },
          },
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
