import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateAdmUseCaseRequest {
  name: string;
  email: string;
  password: string;
  visualIdentity?: string;
}

export class CreateAdmUseCase {
  async execute({
    name,
    email,
    password,
    visualIdentity,
  }: CreateAdmUseCaseRequest) {
    const admRole = await prisma.role.findUnique({
      where: {
        name: 'administrator',
      },
    });

    if (!admRole) {
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

    const passwordHash = await hash(password, 6);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        visualIdentity,
        password: passwordHash,
        roleId: admRole.id,
      },
      select: {
        password: false,
        id: true,
      },
    });

    const adm = await prisma.administrator.create({
      data: { userId: user.id },
    });

    return { ...user, ...adm };
  }
}
