import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetUserUseCaseUseCaseRequest {
  id: string | undefined;
}

export class GetUserUseCase {
  async execute({ id }: GetUserUseCaseUseCaseRequest) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        roleId: false,
        name: true,
        email: true,
        profileUrl: true,
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
