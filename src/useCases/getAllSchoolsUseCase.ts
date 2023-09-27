import { prisma } from '@/lib/prisma';

interface GetAllSchoolsUseCaseRequest {
  perPage: number;
  page: number;
}

export class GetAllSchoolsUseCase {
  async execute({ page, perPage }: GetAllSchoolsUseCaseRequest) {
    const skip = Number(perPage) * (Number(page) - 1);
    const take = Number(perPage);

    const [schools, total] = await prisma.$transaction([
      prisma.school.findMany({
        skip,
        take,
      }),
      prisma.school.count(),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: schools,
      meta: {
        page,
        totalPage,
        perPage,
      },
    };
  }
}
