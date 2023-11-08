import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { DeletePedagogicalVisitUseCase } from '@/useCases/pedagogicalVisit';

export class DeletePedagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deletePedagogicalVisitUseCase = new DeletePedagogicalVisitUseCase();

      await deletePedagogicalVisitUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
