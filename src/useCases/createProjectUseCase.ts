import { prisma } from '@/lib/prisma';

interface CreateProjectUseCaseRequest {
  name: string;
  visualIdentity: string;
  about: string;
}

export class CreateProjectUseCase {
  async execute({ name, about, visualIdentity }: CreateProjectUseCaseRequest) {
    const project = await prisma.project.create({
      data: {
        name,
        visualIdentity,
        about,
      },
    });

    return { project };
  }
}
