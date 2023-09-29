import 'next';

declare module 'next' {
  interface NextApiRequest {
    userId: string;
  }
}
