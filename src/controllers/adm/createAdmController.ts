import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateAdmUseCase } from '@/useCases/adm';

export class CreateAdmController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        visualIdentity: z.string().url().optional(),
        email: z.string().email(),
        password: z.string().min(6),
      });

      const { name, email, password, visualIdentity } =
        registerBodySchema.parse(req.body);

      const createAdmUseCase = new CreateAdmUseCase();
      const user = await createAdmUseCase.execute({
        name,
        email,
        password,
        visualIdentity,
      });

      return res.status(201).json(user);
    } catch (error) {
      throw error;
    }
  }
}
