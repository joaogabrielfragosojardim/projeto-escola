import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetAdmUseCaseRequest {
  id: string | undefined;
}

export class GetAdmUseCase {
  async execute({ id }: GetAdmUseCaseRequest) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        roleId: false,
        name: true,
        email: true,
        visualIdentity: true,
        password: false,
        role: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 400);
    }

    return {
      user,
    };
  }
}
