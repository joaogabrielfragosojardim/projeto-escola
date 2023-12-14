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
        schoolId: z.string().uuid(),
      });

      const { name, email, schoolId, telephone, visualIdentity } =
        createBodySchema.parse(req.body);

      const createCoordinatorUseCase = new CreateCoordinatorUseCase();

      const { coordinator } = await createCoordinatorUseCase.execute({
        name,
        email,
        schoolId,
        telephone,
        visualIdentity,
      });

      return res.status(201).json({ coordinator });
    } catch (error) {
      throw error;
    }
  }
}
