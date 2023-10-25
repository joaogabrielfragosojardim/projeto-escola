import { prisma } from '@/lib/prisma';
import { toSchool } from '@/utils/schoolAdapter';

interface GetAllSchoolsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
  projectId?: string;
  city?: string;
  state?: string;
}

export class GetAllSchoolsUseCase {
  async execute({
    page,
    perPage,
    name,
    projectId,
    city,
    state,
  }: GetAllSchoolsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [schools, total] = await prisma.$transaction([
      prisma.school.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          name: { contains: name, mode: 'insensitive' },
          projectId: { equals: projectId },
          Address: {
            city: { contains: city, mode: 'insensitive' },
            state: { contains: state, mode: 'insensitive' },
          },
        },
        select: {
          id: true,
          name: true,
          visualIdentity: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
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
          projectId: { equals: projectId },
          Address: {
            city: { contains: city, mode: 'insensitive' },
            state: { contains: state, mode: 'insensitive' },
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    return {
      data: toSchool(schools),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
