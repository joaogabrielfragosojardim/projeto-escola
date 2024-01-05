import { prisma } from '@/lib/prisma';

interface GetAllProjectsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
  status?: string;
}

export class GetAllProjectsUseCase {
  async execute({ page, perPage, name, status }: GetAllProjectsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [projects, total] = await prisma.$transaction([
      prisma.project.findMany({
        orderBy: {
          name: 'asc',
        },
        skip,
        take,
        where: {
          name: { contains: name, mode: 'insensitive' },
          status: {
            equals: status ? status === 'true' : undefined,
          },
        },
      }),
      prisma.project.count({
        where: {
          name: { contains: name, mode: 'insensitive' },
          status: {
            equals: status ? status === 'true' : undefined,
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: projects,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
