import { DeleteSchoolUseCase } from '@/useCases/deleteSchoolUseCase';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

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
