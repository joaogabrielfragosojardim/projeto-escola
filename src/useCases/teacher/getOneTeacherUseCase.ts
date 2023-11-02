import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

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
        school: { select: { id: true, name: true } },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!teacher) {
      throw new AppError('Professor não encontrado', 400);
    }

    return {
      teacher,
    };
  }
}
