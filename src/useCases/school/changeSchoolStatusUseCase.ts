import { prisma } from '@/lib/prisma';

interface ChangeSchoolStatusUseCaseRequest {
  schoolId: string;
  status: boolean;
}

export class ChangeSchoolStatusUseCase {
  async execute({ schoolId, status }: ChangeSchoolStatusUseCaseRequest) {
    const school = await prisma.school.update({
      where: { id: schoolId },
      data: {
        status,
      },
    });

    return {
      school,
    };
  }
}
