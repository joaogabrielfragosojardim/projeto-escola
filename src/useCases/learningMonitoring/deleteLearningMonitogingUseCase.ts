import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface DeleteLearningMonitoringUseCaseRequest {
  id: string | undefined;
}

export class DeleteLearningMonitoringUseCase {
  async execute({ id }: DeleteLearningMonitoringUseCaseRequest) {
    const learningMonitoring = await prisma.learningMonitoring.findUnique({
      where: { id },
    });

    if (!learningMonitoring) {
      throw new AppError('Monitoramento de aprendizagem inexistente', 400);
    }

    await prisma.learningMonitoring.delete({
      where: { id },
    });
  }
}
