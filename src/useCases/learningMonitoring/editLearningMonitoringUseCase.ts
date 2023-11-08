import { prisma } from '@/lib/prisma';

interface EditLearningMonitoringUseCaseRequest {
  id: string | undefined;
  writingLevel: string;
  questions: Record<string, string>;
}

export class EditLearningMonitoringUseCase {
  async execute({
    id,
    writingLevel,
    questions,
  }: EditLearningMonitoringUseCaseRequest) {
    const learningMonitoring = await prisma.learningMonitoring.update({
      where: { id },
      data: {
        writingLevel,
        questions,
      },
    });

    return {
      learningMonitoring,
    };
  }
}
