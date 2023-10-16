import { prisma } from '@/lib/prisma';

interface DeleteSchoolUseCaseRequest {
  id: string | undefined;
}

export class DeleteSchoolUseCase {
  async execute({ id }: DeleteSchoolUseCaseRequest) {
    await prisma.school.delete({
      where: { id },
    });
  }
}
