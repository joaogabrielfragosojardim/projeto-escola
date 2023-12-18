import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditStudentUseCase } from '@/useCases/student';

export class EditStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        visualIdentity: z.string().optional(),
        birtday: z.coerce.date(),
        name: z.string(),
        registration: z.string(),
        classRoom: z.object({ period: z.string(), year: z.string() }),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { visualIdentity, birtday, name, classRoom, registration } =
        editBodySchema.parse(req.body);

      const editStudentUseCase = new EditStudentUseCase();

      const { student } = await editStudentUseCase.execute({
        id: id[0],
        visualIdentity,
        birtday,
        name,
        classRoom,
        registration,
      });

      return res.status(200).json({ student });
    } catch (error) {
      throw error;
    }
  }
}
