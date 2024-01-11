import { prisma } from '@/lib/prisma';
import { toCoordinators } from '@/utils/coordinatorAdapter';

interface GetAllCoordinatorsUseCaseRequest {
  perPage: number;
  page: number;
  name?: string;
  projectId?: string;
  schoolId?: string;
  status?: string;
}

export class GetAllCoordinatorsUseCase {
  async execute({
    page,
    perPage,
    name,
    schoolId,
    projectId,
    status,
  }: GetAllCoordinatorsUseCaseRequest) {
    const skip = perPage * (page - 1);
    const take = perPage;

    const [coordinators, total] = await prisma.$transaction([
      prisma.coordinator.findMany({
        skip,
        take,
        where: {
          user: {
            name: { contains: name, mode: 'insensitive' },
          },
          schools: {
            some: {
              schoolId: { equals: schoolId },
              school: {
                projectId: { equals: projectId },
              },
            },
          },
          status: {
            equals: status ? status === 'true' : undefined,
          },
        },
        select: {
          id: true,
          telephone: true,
          status: true,
          schools: {
            select: {
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
      prisma.coordinator.count({
        where: {
          user: {
            name: { contains: name, mode: 'insensitive' },
          },
          schools: {
            some: {
              schoolId: { equals: schoolId },
              school: {
                projectId: { equals: projectId },
              },
            },
          },
          status: {
            equals: status ? status === 'true' : undefined,
          },
        },
      }),
    ]);

    const totalPage = Math.ceil(total / take);

    const order = coordinators.sort((a, b) => {
      const projectA = a.schools[0]?.school?.project?.name || '';
      const projectB = b.schools[0]?.school?.project?.name || '';

      if (projectA !== projectB) {
        return projectA.localeCompare(projectB);
      }

      const schoolA = a.schools[0]?.school?.name || '';
      const schoolB = b.schools[0]?.school?.name || '';

      if (schoolA !== schoolB) {
        return schoolA.localeCompare(schoolB);
      }

      const userA = a.user.name || '';
      const userB = b.user.name || '';

      return userA.localeCompare(userB);
    });

    return {
      data: toCoordinators(order),
      meta: {
        page,
        totalPage,
        perPage,
        total,
      },
    };
  }
}
