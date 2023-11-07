import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditTeacherUseCase } from '@/useCases/teacher';

export class EditTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        visualIdentity: z.string().url().optional(),
        telephone: z.string(),
        name: z.string(),
        classRooms: z.array(z.object({ period: z.string(), year: z.number() })),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { visualIdentity, telephone, name, classRooms } =
        editBodySchema.parse(req.body);

      const editTeacherUseCase = new EditTeacherUseCase();

      const { teacher } = await editTeacherUseCase.execute({
        id: id[0],
        visualIdentity,
        telephone,
        name,
        classRooms,
      });

      return res.status(200).json({ teacher });
    } catch (error) {
      throw error;
    }
  }
}
