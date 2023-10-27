import { prisma } from '@/lib/prisma';

interface GetAllAdmUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
}

export class GetAllAdmUseCase {
  async execute({ page, perPage, name }: GetAllAdmUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [adms, total] = await prisma.$transaction([
      prisma.administrator.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
        where: {
          user: { name: { contains: name, mode: 'insensitive' } },
        },
      }),
      prisma.administrator.count({
        where: {
          user: { name: { contains: name, mode: 'insensitive' } },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: adms,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
