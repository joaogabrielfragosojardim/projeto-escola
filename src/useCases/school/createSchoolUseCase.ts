import { prisma } from '@/lib/prisma';

interface CreateSchoolUseCaseRequest {
  name: string;
  city: string;
  state: string;
  projectId: string;
}

export class CreateSchoolUseCase {
  async execute({ name, city, state, projectId }: CreateSchoolUseCaseRequest) {
    const school = await prisma.school.create({
      data: {
        name,
        city,
        state,
        projectId,
      },
    });

    return {
      school,
    };
  }
}
