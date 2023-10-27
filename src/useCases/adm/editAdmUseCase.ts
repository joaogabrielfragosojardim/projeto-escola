import { hash } from 'bcryptjs';

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
