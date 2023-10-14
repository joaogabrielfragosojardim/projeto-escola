import { prisma } from '@/lib/prisma';

interface ValidateTeacherUseCaseRequest {
  teacherId: string;
  validated: boolean;
}

export class ValidateTeacherUseCase {
  async execute({ teacherId, validated }: ValidateTeacherUseCaseRequest) {
    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        validated,
      },
    });

    return {
      teacher: updatedTeacher,
    };
  }
}
