import { AppError } from '@/errors';
import { AuthenticateUseCase } from '@/useCases/authenticate';

import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { ZodError } from 'zod';

export async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(req.body);

    const authenticateUseCase = new AuthenticateUseCase();

    const { user, token } = await authenticateUseCase.execute({
      email,
      password,
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).send({ message: error.message });
    }

    if (error instanceof ZodError) {
      return res.status(400).send({ message: error.format() });
    }
  }
}
