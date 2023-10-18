import { prisma } from '@/lib/prisma';

export class OptionsSchoolUseCase {
  async execute() {
    const schools = await prisma.school.findMany({
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
