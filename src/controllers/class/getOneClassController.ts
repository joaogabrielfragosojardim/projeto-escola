import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetOneClassUseCase } from '@/useCases/class';

export class GetOneClassController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneClassUseCase = new GetOneClassUseCase();

      const { classroom } = await getOneClassUseCase.execute({
        id: id[0],
      });

      return res.status(200).json({ classroom });
    } catch (error) {
      throw error;
    }
  }
}
