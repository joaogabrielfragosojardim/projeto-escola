import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { DeleteAdmUseCase } from '@/useCases/adm/deleteAdmUseCase';

export class DeleteAdmController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deleteAdmUseCase = new DeleteAdmUseCase();

      await deleteAdmUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
