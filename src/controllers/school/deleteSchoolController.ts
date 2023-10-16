import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { DeleteSchoolUseCase } from '@/useCases/school';

export class DeleteSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deleteSchoolUseCase = new DeleteSchoolUseCase();

      await deleteSchoolUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
