import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface ForgotPasswordUseCaseRequest {
  token: string;
  password: string;
}

export class ResetPasswordUseCase {
  async execute({ token, password }: ForgotPasswordUseCaseRequest) {
    const user = await prisma.user.findUnique({
      where: { passwordToken: token },
      select: {
        passwordToken: true,
        passwordExpiresDate: true,
        id: true,
      },
    });

    if (!user) {
      throw new AppError('Token inválido.');
    }

    const now = new Date();

    if (user.passwordExpiresDate && now > user.passwordExpiresDate) {
      throw new AppError('Token expirado.');
    }

    const passwordHash = await hash(password, 6);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash },
    });
  }
}
