import { prisma } from '@/lib/prisma';

export class OptionsProjectUseCase {
  async execute() {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const options = projects.map((project) => ({
      label: project.name,
      value: project.id,
    }));

    return {
      options,
    };
  }
}
