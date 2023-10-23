import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateSchoolUseCase } from '@/useCases/school';

export class CreateSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        projectId: z.string().uuid(),
        visualIdentity: z.string().url().optional(),
        address: z.object({
          zipCode: z
            .string()
            .min(8, 'Digite 8 caracteres')
            .max(8, 'Digite somente 8 caracteres'),
          city: z.string(),
          state: z.string(),
          street: z.string(),
        }),
      });

      const { name, projectId, visualIdentity, address } =
        createBodySchema.parse(req.body);

      const createSchoolUseCase = new CreateSchoolUseCase();

      const { school } = await createSchoolUseCase.execute({
        name,
        projectId,
        address,
        visualIdentity,
      });

      return res.status(201).json({ school });
    } catch (error) {
      throw error;
    }
  }
}
