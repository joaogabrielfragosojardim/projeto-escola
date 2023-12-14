import { hash } from 'bcryptjs';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';
import { generatePassword } from '@/utils/generateRandomPassword';
import { sendPasswordEmail } from '@/utils/sendPasswordEmail';

interface CreateAdmUseCaseRequest {
  name: string;
  email: string;
  visualIdentity?: string;
}

export class CreateAdmUseCase {
  async execute({ name, email, visualIdentity }: CreateAdmUseCaseRequest) {
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

    const password = generatePassword();

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
        email: true,
        name: true,
      },
    });

    const adm = await prisma.administrator.create({
      data: { userId: user.id },
    });

    sendPasswordEmail({ password, name: user.name, email: user.email });

    return { ...user, ...adm };
  }
}
