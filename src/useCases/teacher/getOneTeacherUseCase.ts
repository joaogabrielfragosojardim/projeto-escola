import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';
import { toTeacher } from '@/utils/teacherAdapter';

interface GetOneTeacherUseCaseRequest {
  id: string | undefined;
}

export class GetOneTeacherUseCase {
  async execute({ id }: GetOneTeacherUseCaseRequest) {
    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        telephone: true,
        status: true,
        school: {
          select: {
            id: true,
            name: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        Classroom: { select: { id: true, period: true, year: true } },
        user: {
          select: {
            email: true,
            name: true,
            visualIdentity: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new AppError('Professor não encontrado', 400);
    }

    return {
      teacher: toTeacher(teacher),
    };
  }
}
