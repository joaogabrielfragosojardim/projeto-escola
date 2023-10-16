import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetOneTeacherUseCase } from '@/useCases/teacher';

export class GetOneTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneTeacherUseCase = new GetOneTeacherUseCase();

      const { teacher } = await getOneTeacherUseCase.execute({
        id: id[0],
      });

      return res.status(200).json({ teacher });
    } catch (error) {
      throw error;
    }
  }
}
