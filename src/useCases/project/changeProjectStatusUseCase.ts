import { prisma } from '@/lib/prisma';

interface ChangeProjectStatusUseCaseRequest {
  projectId: string;
  status: boolean;
}

export class ChangeProjectStatusUseCase {
  async execute({ projectId, status }: ChangeProjectStatusUseCaseRequest) {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        status,
      },
    });

    return {
      project,
    };
  }
}
