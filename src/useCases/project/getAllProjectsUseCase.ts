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
        include: {
          Schools: {
            select: {
              name: true,
            },
          },
        },
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

    const projectsWithSortedSchools = projects.map((project) => {
      const sortedSchools = project.Schools.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      return { ...project, schools: sortedSchools };
    });

    const totalPage = Math.ceil(total / take);

    return {
      data: projectsWithSortedSchools,
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
