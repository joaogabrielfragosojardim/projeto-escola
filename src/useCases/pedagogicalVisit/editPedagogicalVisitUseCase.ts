import { prisma } from '@/lib/prisma';

interface EditPedagogicalVisitUseCaseRequest {
  id: string | undefined;
  date: Date;
  frequency: number;
  observations: string;
  questions: Record<string, string>;
}

export class EditPedagogicalVisitUseCase {
  async execute({
    id,
    date,
    frequency,
    observations,
    questions,
  }: EditPedagogicalVisitUseCaseRequest) {
    const pedagogicalVisit = await prisma.pedagogicalVisit.update({
      where: { id },
      data: {
        date,
        frequency,
        observations,
        questions,
      },
    });

    return {
      pedagogicalVisit,
    };
  }
}
