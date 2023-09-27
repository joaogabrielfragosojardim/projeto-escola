import { prisma } from '@/lib/prisma';

interface EditSchoolUseCaseRequest {
  id: string | undefined;
  name: string;
  city: string;
  state: string;
  projectId: string;
}

export class EditSchoolUseCase {
  async execute({
    id,
    name,
    city,
    state,
    projectId,
  }: EditSchoolUseCaseRequest) {
    const school = await prisma.school.update({
      where: { id },
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
