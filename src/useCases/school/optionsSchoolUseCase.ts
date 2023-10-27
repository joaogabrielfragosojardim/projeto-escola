import { prisma } from '@/lib/prisma';

interface OptionSchoolsUseCaseRequest {
  projectId?: string;
}

export class OptionsSchoolUseCase {
  async execute({ projectId }: OptionSchoolsUseCaseRequest) {
    const schools = await prisma.school.findMany({
      where: {
        projectId: {
          equals: projectId,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const options = schools.map((school) => ({
      label: school.name,
      value: school.id,
    }));

    return {
      options,
    };
  }
}
