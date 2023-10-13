import { prisma } from '@/lib/prisma';

interface GetAllSchoolsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
  city?: string;
  state?: string;
}

export class GetAllSchoolsUseCase {
  async execute({
    page,
    perPage,
    name,
    state,
    city,
  }: GetAllSchoolsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [schools, total] = await prisma.$transaction([
      prisma.school.findMany({
        skip,
        take,
        where: {
          name: { contains: name, mode: 'insensitive' },
          city: { contains: city, mode: 'insensitive' },
          state: { contains: state, mode: 'insensitive' },
        },
      }),
      prisma.school.count({
        where: {
          name: { contains: name, mode: 'insensitive' },
          city: { contains: city, mode: 'insensitive' },
          state: { contains: state, mode: 'insensitive' },
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
