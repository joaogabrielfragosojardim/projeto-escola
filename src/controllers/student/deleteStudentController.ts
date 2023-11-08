import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { DeleteStudentUseCase } from '@/useCases/student/deleteStudentUseCase';

export class DeleteStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deleteStudentUseCase = new DeleteStudentUseCase();

      await deleteStudentUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
