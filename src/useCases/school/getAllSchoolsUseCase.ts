import { prisma } from '@/lib/prisma';
import { toSchool } from '@/utils/schoolAdapter';

interface GetAllSchoolsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
  projectId?: string;
  city?: string;
  state?: string;
  status?: string;
}

export class GetAllSchoolsUseCase {
  async execute({
    page,
    perPage,
    name,
    projectId,
    city,
    state,
    status,
  }: GetAllSchoolsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [schools, total] = await prisma.$transaction([
      prisma.school.findMany({
        skip,
        take,
        orderBy: [
          {
            project: {
              name: 'asc',
            },
          },
          {
            name: 'asc',
          },
        ],
        where: {
          name: { contains: name, mode: 'insensitive' },
          projectId: { equals: projectId },
          Address: {
            city: { contains: city, mode: 'insensitive' },
            state: { contains: state, mode: 'insensitive' },
          },
          status: {
            equals: status ? status === 'true' : undefined,
          },
        },
        select: {
          id: true,
          name: true,
          status: true,
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
              neighborhood: true,
              houseNumber: true,
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
          status: {
            equals: status ? status === 'true' : undefined,
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    const order = schools.sort((a, b) => {
      const projectA = a.project.name || '';
      const projectB = b.project.name || '';

      if (projectA !== projectB) {
        return projectA.localeCompare(projectB);
      }

      const schoolA = a.name || '';
      const schoolB = b.name || '';

      return schoolA.localeCompare(schoolB);
    });

    return {
      data: toSchool(order),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
