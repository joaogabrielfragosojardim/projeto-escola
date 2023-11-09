import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetOneAttendenceUseCase } from '@/useCases/attendence';

export class GetOneAttendenceController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneAttendenceUseCase = new GetOneAttendenceUseCase();

      const { attendance } = await getOneAttendenceUseCase.execute({
        id: id[0],
      });

      return res.status(201).json(attendance);
    } catch (error) {
      throw error;
    }
  }
}
