import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface EditTeacherUseCaseRequest {
  id: string | undefined;
  schoolId: string;
  telephone: string;

  name: string;
}

export class EditTeacherUseCase {
  async execute({ id, name, schoolId, telephone }: EditTeacherUseCaseRequest) {
    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      select: {
        id: true,
      },
    });

    if (!school) {
      throw new AppError('Escola não encontrada', 400);
    }

    const coordinator = await prisma.coordinator.findFirst({
      where: {
        schoolId: school.id,
      },
    });

    if (!coordinator) {
      throw new AppError('Escola enviada não possui coordenador', 400);
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        schoolId: school.id,
        telephone,
        coordinatorId: coordinator.id,
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
