import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateSchoolUseCase } from '@/useCases/createSchoolUseCase';

export class CreateSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        city: z.string(),
        state: z.string(),
        projectId: z.string().uuid(),
      });

      const { name, city, state, projectId } = createBodySchema.parse(req.body);

      const createSchoolUseCase = new CreateSchoolUseCase();

      const { school } = await createSchoolUseCase.execute({
        name,
        city,
        state,
        projectId,
      });

      return res.status(201).json({ school });
    } catch (error) {
      throw error;
    }
  }
}
