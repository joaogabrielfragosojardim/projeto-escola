import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreatePegagogicalVisitUseCaseRequest {
  date: Date;
  frequency: number;
  observations: string;
  questions: Record<string, string>;
  classId: string;
  coordinatorId: string;
}

export class CreatePegagogicalVisitUseCase {
  async execute({
    date,
    frequency,
    observations,
    questions,
    classId,
    coordinatorId,
  }: CreatePegagogicalVisitUseCaseRequest) {
    const coordinator = await prisma.coordinator.findFirst({
      where: {
        id: coordinatorId,
      },
    });

    if (!coordinator) {
      throw new AppError('Coordenador não encontrado', 400);
    }

    const school = await prisma.school.findFirst({
      where: {
        id: coordinator.schoolId,
      },
    });

    if (!school) {
      throw new AppError('Escola não encontrada', 400);
    }

    const classroom = await prisma.classroom.findFirst({
      where: {
        id: classId,
      },
    });

    if (!classroom) {
      throw new AppError('Turma não encontrada', 400);
    }

    if (classroom.schoolId !== school.id) {
      throw new AppError('Essa turma não pertence a essa escola', 400);
    }

    const pegagogicalVisit = await prisma.pegagogicalVisit.create({
      data: {
        date,
        frequency,
        observations,
        questions,
        schoolId: school.id,
        classId: classroom.id,
        coordinatorId: coordinator.id,
      },
    });

    return {
      pegagogicalVisit,
    };
  }
}
