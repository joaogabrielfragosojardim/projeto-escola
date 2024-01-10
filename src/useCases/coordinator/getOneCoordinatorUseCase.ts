import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';
import { toCoordinator } from '@/utils/coordinatorAdapter';

interface GetOneCoordinatorUseCaseRequest {
  id: string | undefined;
}

export class GetOneCoordinatorUseCase {
  async execute({ id }: GetOneCoordinatorUseCaseRequest) {
    const coordinator = await prisma.coordinator.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        telephone: true,
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
    });

    if (!coordinator) {
      throw new AppError('Coordenador não encontrado', 400);
    }

    return {
      coordinator: toCoordinator(coordinator),
    };
  }
}
