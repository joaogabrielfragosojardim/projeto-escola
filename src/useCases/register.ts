import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
  roleId: string;
  userId: string;
}

export class RegisterUseCase {
  async execute({
    name,
    email,
    password,
    roleId,
    userId,
  }: RegisterUseCaseRequest) {
    const creator = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });

    if (!creator) {
      throw new AppError('Usuário inexistente', 400);
    }

    const roleExists = await prisma.role.findUnique({
      where: {
        id: roleId,
      },
    });

    if (!roleExists) {
      throw new AppError('Cargo inexistente', 400);
    }

    if (creator.role.level < roleExists.level) {
      throw new AppError(
        'Você não tem permissão para cadastrar este tipo de usuário',
        403
      );
    }
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new AppError('Email já cadastrado', 400);
    }

    const password_hash = await hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: password_hash,
        roleId,
      },
    });

    return user;
  }
}
