import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneClassUseCaseRequest {
  id: string | undefined;
}

export class GetOneClassUseCase {
  async execute({ id }: GetOneClassUseCaseRequest) {
    const classroom = await prisma.classroom.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        teachers: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        students: {
          select: {
            id: true,
            birtday: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!classroom) {
      throw new AppError('Turma não encontrada', 400);
    }

    return {
      classroom,
    };
  }
}
