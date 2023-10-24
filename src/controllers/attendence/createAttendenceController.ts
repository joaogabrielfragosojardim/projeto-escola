import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateAttendanceUseCase } from '@/useCases/attendence/createAttendenceUseCase';

export class CreateAttendenceController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const querySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = querySchema.parse(req.query);

      const createBodySchema = z.object({
        students: z.array(
          z.object({
            id: z.string().uuid(),
            isPresent: z.boolean(),
          }),
        ),
        date: z.coerce.date(),
      });

      const { students, date } = createBodySchema.parse(req.body);

      const createAttendanceUseCase = new CreateAttendanceUseCase();

      await createAttendanceUseCase.execute({
        date,
        students,
        classId: id[0],
      });

      return res
        .status(201)
        .json({ message: 'Presença registrada com sucesso' });
    } catch (error) {
      throw error;
    }
  }
}
