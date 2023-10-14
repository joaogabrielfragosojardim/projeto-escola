import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  roleId: string;
  creatorId: string;
  profileUrl: string;
}

export class CreateUserUseCase {
  async execute({
    name,
    email,
    password,
    roleId,
    creatorId,
    profileUrl,
  }: CreateUserUseCaseRequest) {
    const creator = await prisma.user.findUnique({
      where: {
        id: creatorId,
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
        403,
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

    const passwordHash = await hash(password, 6);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        roleId,
        profileUrl,
      },
    });

    return user;
  }
}
