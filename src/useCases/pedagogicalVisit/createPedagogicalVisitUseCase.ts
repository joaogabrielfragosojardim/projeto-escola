import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreatePedagogicalVisitUseCaseRequest {
  date: Date;
  frequency: number;
  observations: string;
  questions: Record<string, string>;
  classId: string;
  coordinatorId: string;
  teacherId: string;
}

export class CreatePedagogicalVisitUseCase {
  async execute({
    date,
    frequency,
    observations,
    questions,
    classId,
    coordinatorId,
    teacherId,
  }: CreatePedagogicalVisitUseCaseRequest) {
    const coordinator = await prisma.coordinator.findFirst({
      where: {
        userId: coordinatorId,
      },
      select: {
        id: true,
        schools: {
          select: {
            schoolId: true,
          },
        },
      },
    });

    if (!coordinator) {
      throw new AppError('Coordenador não encontrado', 400);
    }
    const schools = await prisma.school.findMany({
      where: {
        id: { in: coordinator.schools.map((school) => school.schoolId) },
      },
    });

    if (!schools) {
      throw new AppError('Escolas não encontradas', 400);
    }

    const classroom = await prisma.classroom.findFirst({
      where: {
        id: classId,
      },
      select: {
        id: true,
        teachers: true,
        schoolId: true,
      },
    });

    if (!classroom) {
      throw new AppError('Turma não encontrada', 400);
    }

    const isSchoolExisting = schools.some(
      (school) => school.id === classroom.schoolId,
    );
    if (!isSchoolExisting) {
      throw new AppError('Essa turma não pertence a essa escola', 400);
    }

    if (!classroom.teachers.some((item) => item.id)) {
      throw new AppError('Professor não esta na turma!', 400);
    }

    const pedagogicalVisit = await prisma.pedagogicalVisit.create({
      data: {
        date,
        frequency,
        observations,
        questions,
        schoolId: classroom.schoolId,
        classId: classroom.id,
        coordinatorId: coordinator.id,
        teacherId,
      },
    });

    return {
      pedagogicalVisit,
    };
  }
}
