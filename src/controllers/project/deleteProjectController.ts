import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { DeleteProjectUseCase } from '@/useCases/deleteProjectUseCase';

export class DeleteProjectController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deleteProjectUseCase = new DeleteProjectUseCase();

      await deleteProjectUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
