import { compare, hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface ChangeUserPasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  userId: string;
}

export class ChangeUserPasswordUseCase {
  async execute({
    oldPassword,
    confirmNewPassword,
    newPassword,
    userId,
  }: ChangeUserPasswordRequest) {
    if (newPassword !== confirmNewPassword) {
      throw new AppError('As senhas não estão iguais', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('Usuário não cadastrado', 400);
    }

    const passwordMatch = await compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new AppError('Senha incorreta');
    }

    const passwordHash = await hash(newPassword, 6);

    const newUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        isFirstAccess: false,
      },
    });

    // @ts-ignore
    newUser.password = undefined;

    return {
      user: newUser,
    };
  }
}
