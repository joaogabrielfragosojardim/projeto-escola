import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface EditTeacherUseCaseRequest {
  id: string | undefined;
  schoolId: string;
  telephone: string;
  coordinatorId: string;
  name: string;
}

export class EditTeacherUseCase {
  async execute({
    id,
    name,
    schoolId,
    telephone,
    coordinatorId,
  }: EditTeacherUseCaseRequest) {
    const coordinator = await prisma.coordinator.findUnique({
      where: {
        id: coordinatorId,
      },
      select: {
        schoolId: true,
      },
    });

    if (!coordinator || coordinator.schoolId !== schoolId) {
      throw new AppError('Coordenador não vinculado à mesma escola', 400);
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        schoolId,
        telephone,
        coordinatorId,
      },
      select: {
        id: true,
        telephone: true,
        schoolId: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    const user = await prisma.user.update({
      where: { id: teacher.user.id },
      data: {
        name,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return {
      teacher: {
        ...teacher,
        ...user,
      },
    };
  }
}
