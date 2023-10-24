import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneProjectUseCaseRequest {
  id: string | undefined;
}

export class GetOneProjectUseCase {
  async execute({ id }: GetOneProjectUseCaseRequest) {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        visualIdentity: true,
        about: true,
        Schools: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Projeto não encontrado', 400);
    }

    return {
      project,
    };
  }
}
