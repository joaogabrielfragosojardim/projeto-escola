import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface DeleteTeacherUseCaseRequest {
  id: string | undefined;
}

export class DeleteTeacherUseCase {
  async execute({ id }: DeleteTeacherUseCaseRequest) {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!teacher) {
      throw new AppError('Usuário inexistente', 400);
    }

    await prisma.teacher.delete({
      where: { id },
    });

    // Delete o usuário associado ao professor
    await prisma.user.delete({
      where: { id: teacher.userId },
    });
  }
}
