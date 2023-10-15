import type { Role, User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: {
    role: Pick<Role, 'name' | 'description'>;
  } & Pick<User, 'name' | 'email' | 'id'>;
  token: string;
}

const secret = process.env.SECRET_KEY || '';

export class AuthenticateUseCase {
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        roleId: false,
        name: true,
        email: true,
        password: true,
        role: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('E-mail ou senha inválidos', 400);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha inválidos');
    }

    // @ts-ignore
    user.password = undefined;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: '7d',
    });

    return {
      user,
      token,
    };
  }
}
