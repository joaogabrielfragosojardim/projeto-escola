import crypto from 'node:crypto';

export function generateEmail(nome: string): string {
  const dominio: string = '@exemplo.com';
  const hash = crypto.createHash('sha1').update(nome).digest('hex').slice(0, 8);
  const email: string =
    nome.replace(' ', '_').trim().toLowerCase() + hash + dominio;

  return email;
}
