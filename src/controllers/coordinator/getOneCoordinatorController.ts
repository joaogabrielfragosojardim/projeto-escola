import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetOneCoordinatorUseCase } from '@/useCases/GetOneCoordinatorUseCase';

export class GetOneCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneCoordinatorUseCase = new GetOneCoordinatorUseCase();

      const { coordinator } = await getOneCoordinatorUseCase.execute({
        id: id[0],
      });

      return res.status(200).json({ coordinator });
    } catch (error) {
      throw error;
    }
  }
}
