import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateTeacherUseCaseRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  schoolId: string;
  coordinatorId: string;
  visualIdentity?: string;
}

export class CreateTeacherUseCase {
  async execute({
    name,
    email,
    password,
    telephone,
    schoolId,
    coordinatorId,
    visualIdentity,
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

    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!school) {
      throw new AppError('Escola inexistente', 400);
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

    const passwordHash = await hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        visualIdentity,
        password: passwordHash,
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
