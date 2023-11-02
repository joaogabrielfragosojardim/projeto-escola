import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface EditAdmUseCaseRequest {
  id: string | undefined;
  name: string;
  password?: string;
  visualIdentity?: string;
}

export class EditAdmUseCase {
  async execute({ id, name, password, visualIdentity }: EditAdmUseCaseRequest) {
    if (password) {
      const passwordHash = await hash(password, 6);

      const administrator = await prisma.administrator.findUnique({
        where: { id },
        select: {
          userId: true,
        },
      });

      if (!administrator) {
        throw new Error('Adminstrador não encontrado');
      }

      const user = await prisma.user.update({
        where: { id: administrator.userId },
        data: {
          name,
          visualIdentity,
          password: passwordHash,
        },
      });

      return { user };
    }

    const administrator = await prisma.administrator.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!administrator) {
      throw new AppError('Adminstrador não encontrado');
    }

    const user = await prisma.user.update({
      where: { id: administrator.userId },
      data: {
        name,
        visualIdentity,
      },
    });

    return {
      user,
    };
  }
}
