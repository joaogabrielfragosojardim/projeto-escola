import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateAdmUseCase } from '@/useCases/adm';

export class CreateAdmController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        visualIdentity: z.string().optional(),
        email: z.string().email(),
      });

      const { name, email, visualIdentity } = registerBodySchema.parse(
        req.body,
      );

      const createAdmUseCase = new CreateAdmUseCase();
      const user = await createAdmUseCase.execute({
        name,
        email,
        visualIdentity,
      });

      return res.status(201).json(user);
    } catch (error) {
      throw error;
    }
  }
}
