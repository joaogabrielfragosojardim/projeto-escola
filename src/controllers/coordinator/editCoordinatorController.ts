import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditCoordinatorUseCase } from '@/useCases/coordinator';

export class EditCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        schoolIds: z.array(z.string().uuid()),
        telephone: z.string(),
        name: z.string(),
        visualIdentity: z.string().optional(),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { schoolIds, telephone, name, visualIdentity } =
        editBodySchema.parse(req.body);

      const editCoordinatorUseCase = new EditCoordinatorUseCase();

      const { coordinator } = await editCoordinatorUseCase.execute({
        id: id[0],
        schoolIds,
        telephone,
        name,
        visualIdentity,
      });

      return res.status(200).json({ coordinator });
    } catch (error) {
      throw error;
    }
  }
}
