import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneStudentUseCaseRequest {
  id: string | undefined;
}

export class GetOneStudentUseCase {
  async execute({ id }: GetOneStudentUseCaseRequest) {
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        birtday: true,
        user: {
          select: {
            email: true,
            name: true,
            visualIdentity: true,
          },
        },
        school: {
          select: {
            id: true,
            name: true,
          },
        },
        Classroom: {
          select: {
            period: true,
            year: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError('Aluno não encontrado', 400);
    }

    return {
      student,
    };
  }
}
