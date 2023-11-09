import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface DeleteAttendenceUseCaseRequest {
  id: string | undefined;
}

export class DeleteAttendenceUseCase {
  async execute({ id }: DeleteAttendenceUseCaseRequest) {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new AppError('Frequência não encontrada', 400);
    }

    await prisma.attendance.delete({
      where: { id },
    });
  }
}
