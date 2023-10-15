import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateSchoolUseCase } from '@/useCases/school';

export class CreateSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        projectId: z.string().uuid(),
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

      const { name, projectId, address } = createBodySchema.parse(req.body);

      const createSchoolUseCase = new CreateSchoolUseCase();

      const { school } = await createSchoolUseCase.execute({
        name,
        projectId,
        address,
      });

      return res.status(201).json({ school });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
