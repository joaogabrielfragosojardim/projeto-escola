import { prisma } from '@/lib/prisma';

interface GetAllSchoolsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
}

export class GetAllSchoolsUseCase {
  async execute({ page, perPage, name }: GetAllSchoolsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [schools, total] = await prisma.$transaction([
      prisma.school.findMany({
        skip,
        take,
        where: {
          name: { contains: name, mode: 'insensitive' },
        },
        select: {
          id: true,
          name: true,
          projectId: true,
          Address: {
            select: {
              city: true,
              state: true,
              street: true,
              zipCode: true,
            },
          },
        },
      }),
      prisma.school.count({
        where: {
          name: { contains: name, mode: 'insensitive' },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: schools,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
