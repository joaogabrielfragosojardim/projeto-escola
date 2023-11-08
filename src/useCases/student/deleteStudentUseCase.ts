import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface DeleteStudentUseCaseRequest {
  id: string | undefined;
}

export class DeleteStudentUseCase {
  async execute({ id }: DeleteStudentUseCaseRequest) {
    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!student) {
      throw new AppError('Usuário inexistente', 400);
    }

    await prisma.student.delete({
      where: { id },
    });

    await prisma.user.delete({
      where: { id: student.userId },
    });
  }
}
