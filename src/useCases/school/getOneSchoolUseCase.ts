import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface GetOneSchoolUseCaseRequest {
  id?: string;
}

export class GetOneSchoolUseCase {
  async execute({ id }: GetOneSchoolUseCaseRequest) {
    const school = await prisma.school.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        visualIdentity: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        Address: {
          select: {
            id: true,
            city: true,
            state: true,
            street: true,
            zipCode: true,
          },
        },
      },
    });

    if (!school) {
      throw new AppError('Escola não encontrada', 400);
    }

    return {
      school: {
        id: school.id,
        name: school.name,
        visualIdentity: school?.visualIdentity,
        project: {
          id: school.project.id,
          name: school.project.name,
        },
        address: {
          ...school.Address,
        },
      },
    };
  }
}
