import { verify } from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next/types';

const secret = process.env.SECRET_KEY || '';

export const verifyJWT = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Token de autenticação não fornecido.' });
  }

  try {
    const { sub } = verify(token, secret);
    req.userId = sub;
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
