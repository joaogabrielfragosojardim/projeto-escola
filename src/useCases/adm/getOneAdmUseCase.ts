import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';
import { toAdm } from '@/utils/admAdapter';

interface GetOneCoordinatorUseCaseRequest {
  id: string | undefined;
}

export class GetOneAdmUseCase {
  async execute({ id }: GetOneCoordinatorUseCaseRequest) {
    const adm = await prisma.administrator.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            email: true,
            visualIdentity: true,
          },
        },
      },
    });

    if (!adm) {
      throw new AppError('Adm não encontrado', 400);
    }

    return {
      adm: toAdm(adm),
    };
  }
}
