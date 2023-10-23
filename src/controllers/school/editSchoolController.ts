import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditSchoolUseCase } from '@/useCases/school';

export class EditSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
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

      const { id } = editQuerySchema.parse(req.query);
      const { name, address, projectId, visualIdentity } = editBodySchema.parse(
        req.body,
      );

      const editSchoolUseCase = new EditSchoolUseCase();

      const { school } = await editSchoolUseCase.execute({
        id: id[0],
        name,
        address,
        visualIdentity,
        projectId,
      });

      return res.status(200).json({ school });
    } catch (error) {
      throw error;
    }
  }
}
