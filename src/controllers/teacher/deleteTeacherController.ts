import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { DeleteTeacherUseCase } from '@/useCases/teacher';

export class DeleteTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deleteTeacherUseCase = new DeleteTeacherUseCase();

      await deleteTeacherUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
