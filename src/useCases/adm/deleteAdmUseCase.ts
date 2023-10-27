import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface DeleteAdmUseCaseRequest {
  id: string | undefined;
}

export class DeleteAdmUseCase {
  async execute({ id }: DeleteAdmUseCaseRequest) {
    const adm = await prisma.administrator.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!adm) {
      throw new AppError('Usuário inexistente', 400);
    }

    await prisma.administrator.delete({
      where: { id },
    });

    await prisma.user.delete({
      where: { id: adm.userId },
    });
  }
}
