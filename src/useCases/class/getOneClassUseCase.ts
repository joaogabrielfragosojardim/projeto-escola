import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneClassUseCaseRequest {
  id: string | undefined;
}

export class GetOneClassUseCase {
  async execute({ id }: GetOneClassUseCaseRequest) {
    const classroom = await prisma.class.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        session: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
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
        grade: {
          select: {
            id: true,
            name: true,
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
