import crypto from 'node:crypto';

export function generateEmail(nome: string): string {
  const dominio: string = '@exemplo.com'; // Substitua pelo seu domínio de email
  const hash = crypto.createHash('sha1').update(nome).digest('hex').slice(0, 8); // Gera um hash único a partir do nome
  const email: string =
    nome.replace(' ', '_').trim().toLowerCase() + hash + dominio;

  return email;
}
