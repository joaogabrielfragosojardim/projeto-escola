import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateClassUseCaseRequest {
  name: string;
  session: string;
  schoolId: string;
  gradeId: string;
  teacherId: string;
}

export class CreateClassUseCase {
  async execute({
    name,
    session,
    schoolId,
    gradeId,
    teacherId,
  }: CreateClassUseCaseRequest) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
      select: {
        schoolId: true,
      },
    });

    if (!teacher || teacher.schoolId !== schoolId) {
      throw new AppError('Professor não vinculado à mesma escola', 400);
    }

    const classroom = await prisma.classroom.create({
      data: {
        name,
        session,
        schoolId,
        gradeId,
        teacherId,
      },
      select: {
        id: true,
        session: true,
        name: true,
        grade: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      classroom: {
        ...classroom,
        id: classroom.id,
        name: `${classroom.name} - ${classroom.grade.name} - ${classroom.session}`,
      },
    };
  }
}
