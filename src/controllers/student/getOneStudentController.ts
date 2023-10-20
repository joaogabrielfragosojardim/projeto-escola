import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetOneStudentUseCase } from '@/useCases/student';

export class GetOneStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneStudentUseCase = new GetOneStudentUseCase();

      const { student } = await getOneStudentUseCase.execute({
        id: id[0],
      });

      return res.status(200).json({ student });
    } catch (error) {
      throw error;
    }
  }
}
