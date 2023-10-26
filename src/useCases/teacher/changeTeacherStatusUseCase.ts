import { prisma } from '@/lib/prisma';

interface ChangeTeacherStatusUseCaseRequest {
  teacherId: string;
  status: boolean;
}

export class ChangeTeacherStatusUseCase {
  async execute({ teacherId, status }: ChangeTeacherStatusUseCaseRequest) {
    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        status,
      },
    });

    return {
      teacher,
    };
  }
}
