import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ChangeTeacherStatusUseCase } from '@/useCases/teacher';

export class ChangeTeacherStatusController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editBodySchema = z.object({
        teacherId: z.string().uuid(),
        status: z.boolean(),
      });

      const { teacherId, status } = editBodySchema.parse(req.body);

      const changeTeacherStatusUseCase = new ChangeTeacherStatusUseCase();

      const { teacher } = await changeTeacherStatusUseCase.execute({
        teacherId,
        status,
      });

      return res.status(200).json({ teacher });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
