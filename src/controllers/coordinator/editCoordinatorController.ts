import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditCoordinatorUseCase } from '@/useCases/EditCoordinatorUseCase';

export class EditCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        schoolId: z.string(),
        telephone: z.string(),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { schoolId, telephone } = editBodySchema.parse(req.body);

      const editCoordinatorUseCase = new EditCoordinatorUseCase();

      const { coordinator } = await editCoordinatorUseCase.execute({
        id: id[0],
        schoolId,
        telephone,
      });

      return res.status(200).json({ coordinator });
    } catch (error) {
      throw error;
    }
  }
}
