import { prisma } from '@/lib/prisma';

interface EditProjectUseCaseRequest {
  id: string | undefined;
  name: string;
  about: string;
  visualIdentity: string;
}

export class EditProjectUseCase {
  async execute({
    id,
    name,
    about,
    visualIdentity,
  }: EditProjectUseCaseRequest) {
    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        about,
        visualIdentity,
      },
    });

    return {
      project,
    };
  }
}
