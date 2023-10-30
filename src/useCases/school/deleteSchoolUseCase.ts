import { prisma } from '@/lib/prisma';

interface DeleteSchoolUseCaseRequest {
  id: string | undefined;
}

export class DeleteSchoolUseCase {
  async execute({ id }: DeleteSchoolUseCaseRequest) {
    if (!id) return;

    await prisma.classroom.deleteMany({
      where: {
        schoolId: id,
      },
    });

    await prisma.school.delete({
      where: { id },
    });
  }
}
