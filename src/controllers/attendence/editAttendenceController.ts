import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { EditAttendenceUseCase } from '@/useCases/attendence';

export class EditAttendenceController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        date: z.coerce.date(),
        isPresent: z.coerce.boolean(),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { date, isPresent } = editBodySchema.parse(req.body);

      const editAttendenceUseCase = new EditAttendenceUseCase();

      const { attendance } = await editAttendenceUseCase.execute({
        id: id[0],
        date,
        isPresent,
      });

      return res.status(200).json({ attendance });
    } catch (error) {
      throw error;
    }
  }
}
