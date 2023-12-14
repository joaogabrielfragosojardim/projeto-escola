export function generatePassword(length: number = 6): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let password = '';

  const charactersLength = characters.length;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);

    password += characters.charAt(randomIndex);
  }

  return password;
}
