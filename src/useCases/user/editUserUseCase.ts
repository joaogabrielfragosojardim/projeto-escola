import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

interface EditUserUseCaseRequest {
  id: string | undefined;
  name: string;
  password?: string;
  profileUrl: string;
}

export class EditUserUseCase {
  async execute({ id, name, password, profileUrl }: EditUserUseCaseRequest) {
    if (password) {
      const passwordHash = await hash(password, 6);

      const user = await prisma.user.update({
        where: { id },
        data: {
          name,
          profileUrl,
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
        profileUrl,
      },
    });

    return {
      user,
    };
  }
}
