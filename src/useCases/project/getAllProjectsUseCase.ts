import { prisma } from '@/lib/prisma';

interface GetAllProjectsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
}

export class GetAllProjectsUseCase {
  async execute({ page, perPage, name }: GetAllProjectsUseCaseRequest) {
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
        },
      }),
      prisma.project.count({
        where: {
          name: { contains: name, mode: 'insensitive' },
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
