import { AuthenticateUseCase } from '@/useCases/authenticateUseCase';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export class AuthenticateController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
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
      throw error;
    }
  }
}
