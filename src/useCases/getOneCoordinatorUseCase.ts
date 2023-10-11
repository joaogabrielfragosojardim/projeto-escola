import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

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
        telephone: true,
        schoolId: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!coordinator) {
      throw new AppError('Coordenador não encontrado', 400);
    }

    return {
      coordinator,
    };
  }
}
