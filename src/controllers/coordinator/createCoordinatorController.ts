import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateCoordinatorUseCase } from '@/useCases/coordinator';

export class CreateCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        visualIdentity: z.string().optional(),
        telephone: z.string(),
        schoolIds: z.array(z.string().uuid()),
      });

      const { name, email, schoolIds, telephone, visualIdentity } =
        createBodySchema.parse(req.body);

      const createCoordinatorUseCase = new CreateCoordinatorUseCase();

      const { coordinator } = await createCoordinatorUseCase.execute({
        name,
        email,
        schoolIds,
        telephone,
        visualIdentity,
      });

      return res.status(201).json({ coordinator });
    } catch (error) {
      throw error;
    }
  }
}
