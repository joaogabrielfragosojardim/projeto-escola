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
    });

    if (!project) {
      throw new AppError('Projeto não encontrado', 400);
    }

    return {
      project,
    };
  }
}
