import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneSchoolUseCaseRequest {
  id: string | undefined;
}

export class GetOneSchoolUseCase {
  async execute({ id }: GetOneSchoolUseCaseRequest) {
    const school = await prisma.school.findUnique({
      where: {
        id,
      },
    });

    if (!school) {
      throw new AppError('Escola não encontrada', 400);
    }

    return {
      school,
    };
  }
}
