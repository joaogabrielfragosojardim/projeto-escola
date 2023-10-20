import { prisma } from '@/lib/prisma';

interface ChangeStudentStatusUseCaseRequest {
  studentId: string;
  status: boolean;
}

export class ChangeStudentStatusUseCase {
  async execute({ studentId, status }: ChangeStudentStatusUseCaseRequest) {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: {
        status,
      },
    });

    return {
      student,
    };
  }
}
