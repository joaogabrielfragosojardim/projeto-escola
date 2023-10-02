import { prisma } from '@/lib/prisma';

interface DeleteProjectUseCaseRequest {
  id: string | undefined;
}

export class DeleteProjectUseCase {
  async execute({ id }: DeleteProjectUseCaseRequest) {
    await prisma.project.delete({
      where: { id },
    });
  }
}
