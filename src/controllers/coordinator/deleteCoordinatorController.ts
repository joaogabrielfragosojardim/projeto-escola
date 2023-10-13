import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { DeleteCoordinatorUseCase } from '@/useCases/coordinator';

export class DeleteCooordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deleteCoordinatorUseCase = new DeleteCoordinatorUseCase();

      await deleteCoordinatorUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
