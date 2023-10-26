/* eslint-disable no-await-in-loop */
import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateAttendanceUseCaseRequest {
  classId?: string;
  date: Date;
  students: {
    id: string;
    isPresent: boolean;
  }[];
}

export class CreateAttendanceUseCase {
  async execute({ students, date, classId }: CreateAttendanceUseCaseRequest) {
    const classroom = await prisma.classroom.findFirst({
      where: {
        id: classId,
      },
      select: {
        id: true,
      },
    });

    if (!classroom) {
      throw new AppError('Turma não encontrada', 400);
    }

    for (const { id: studentId } of students) {
      const aluno = await prisma.student.findUniqueOrThrow({
        where: { id: studentId, classId: classroom.id },
      });

      if (!aluno) {
        throw new AppError(`Aluno não pertence a esta turma`, 400);
      }
    }

    for (const { id, isPresent } of students) {
      await prisma.attendance.create({
        data: {
          date,
          isPresent,
          studentId: id,
          classId: classroom.id,
        },
      });
    }
  }
}
