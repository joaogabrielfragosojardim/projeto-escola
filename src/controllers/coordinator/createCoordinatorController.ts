import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateCoordinatorUseCase } from '@/useCases/coordinator';

export class CreateCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        profileUrl: z.string().url(),
        telephone: z.string(),
        schoolId: z.string().uuid(),
      });

      const { name, email, password, schoolId, telephone, profileUrl } =
        createBodySchema.parse(req.body);

      const createCoordinatorUseCase = new CreateCoordinatorUseCase();

      const { coordinator } = await createCoordinatorUseCase.execute({
        name,
        email,
        password,
        schoolId,
        telephone,
        profileUrl,
      });

      return res.status(201).json({ coordinator });
    } catch (error) {
      throw error;
    }
  }
}
