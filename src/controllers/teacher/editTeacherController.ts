import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditTeacherUseCase } from '@/useCases/teacher/editTeacherUseCase';

export class EditTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        schoolId: z.string().uuid(),
        telephone: z.string(),
        coordinatorId: z.string().uuid(),
        name: z.string(),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { schoolId, telephone, name, coordinatorId } = editBodySchema.parse(
        req.body,
      );

      const editTeacherUseCase = new EditTeacherUseCase();

      const { teacher } = await editTeacherUseCase.execute({
        id: id[0],
        schoolId,
        telephone,
        name,
        coordinatorId,
      });

      return res.status(200).json({ teacher });
    } catch (error) {
      throw error;
    }
  }
}
