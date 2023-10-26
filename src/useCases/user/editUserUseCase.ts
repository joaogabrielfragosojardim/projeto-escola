import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

interface EditUserUseCaseRequest {
  id: string | undefined;
  name: string;
  password?: string;
  visualIdentity?: string;
}

export class EditUserUseCase {
  async execute({
    id,
    name,
    password,
    visualIdentity,
  }: EditUserUseCaseRequest) {
    if (password) {
      const passwordHash = await hash(password, 6);

      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          visualIdentity,
          password: passwordHash,
        },
      });

      return {
        user,
      };
    }

    const user = await prisma.user.update({
      where: { id },
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
