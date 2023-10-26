import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateCoordinatorUseCaseRequest {
  name: string;
  email: string;
  password: string;
  telephone: string;
  schoolId: string;
  visualIdentity?: string;
}

export class CreateCoordinatorUseCase {
  async execute({
    name,
    email,
    password,
    telephone,
    visualIdentity,
    schoolId,
  }: CreateCoordinatorUseCaseRequest) {
    const coordinatorRole = await prisma.role.findUnique({
      where: {
        name: 'coordinator',
      },
    });

    if (!coordinatorRole) {
      throw new AppError('Cargo inexistente', 400);
    }

    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!school) {
      throw new AppError('Escola inexistente', 400);
    }

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError('Email já cadastrado', 400);
    }

    const passwordHash = await hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        visualIdentity,
        password: passwordHash,
        roleId: coordinatorRole.id,
      },
      select: {
        password: false,
        id: true,
      },
    });

    const coordinator = await prisma.coordinator.create({
      data: {
        telephone,
        userId: user.id,
        schoolId,
      },
    });

    return {
      coordinator: { ...user, ...coordinator },
    };
  }
}
