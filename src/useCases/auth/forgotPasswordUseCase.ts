import crypto from 'node:crypto';

import { Resend } from 'resend';

import { EmailTemplate } from '@/emails';
import { AppError } from '@/errors';
import { prisma } from '@/lib/prisma';

interface ForgotPasswordUseCaseRequest {
  email: string;
}

const EXPIRATION_DURATION = 3;
const resend = new Resend(process.env.RESEND_API_KEY);
export class ForgotPasswordUseCase {
  async execute({ email }: ForgotPasswordUseCaseRequest) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError('Usuário não existe.');
    }

    const passwordToken = crypto.randomUUID();

    const passwordExpiresDate = new Date();

    passwordExpiresDate.setHours(
      passwordExpiresDate.getHours() + EXPIRATION_DURATION,
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordToken,
        passwordExpiresDate,
      },
    });

    const data = await resend.emails
      .send({
        from: 'Escola Prime <onboarding@resend.dev>',
        to: [user.email],
        subject: 'Recuperação de senha',
        react: EmailTemplate({
          email: user.email,
          url: `http://localhost:3000/reset-password?token=${passwordToken}`,
        }),
        text: '',
      })
      .catch(() => {
        throw new AppError('Ocorreu um erro ao enviar o e-mail.');
      });

    return data;
  }
}
