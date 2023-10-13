import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateTeacherUseCaseRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  schoolId: string;
  coordinatorId: string;
}

export class CreateTeacherUseCase {
  async execute({
    name,
    email,
    password,
    telephone,
    schoolId,
    coordinatorId,
  }: CreateTeacherUseCaseRequest) {
    const teacherRole = await prisma.role.findUnique({
      where: {
        name: 'teacher',
      },
    });

    if (!teacherRole) {
      throw new AppError('Cargo inexistente', 400);
    }

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError('Email já cadastrado', 400);
    }

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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        roleId: teacherRole.id,
      },
      select: {
        password: false,
        id: true,
      },
    });

    const teacher = await prisma.teacher.create({
      data: {
        telephone,
        schoolId,
        coordinatorId,
        userId: user.id,
      },
    });

    return {
      teacher: { ...user, ...teacher },
    };
  }
}
