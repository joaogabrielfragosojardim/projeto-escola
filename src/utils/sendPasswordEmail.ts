import { PasswordEmail } from '@/emails/passwordEmail';
import { AppError } from '@/errors';
import { resend } from '@/lib/resend';

interface Props {
  password: string;
  name: string;
  email: string;
}

export async function sendPasswordEmail({ password, name, email }: Props) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(
    '/api',
    '',
  ) as string;

  const data = await resend.emails
    .send({
      from: 'Escola Prime <adm@escolaprimepe.com.br>',
      to: [email],
      subject: 'Bem-vindo à nossa plataforma - Primeiro acesso',
      react: PasswordEmail({
        password,
        name,
        url: BASE_URL,
      }),
      text: '',
    })
    .catch(() => {
      throw new AppError('Ocorreu um erro ao enviar o e-mail.');
    });

  return data;
}
