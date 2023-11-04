import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetOnePedagogicalVisitUseCase } from '@/useCases/pedagogicalVisit';

export class GetOnePedagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOnePedagogicalVisitUseCase = new GetOnePedagogicalVisitUseCase();

      const { pedagogicalVisit } = await getOnePedagogicalVisitUseCase.execute({
        id: id[0],
      });

      return res.status(200).json({ pedagogicalVisit });
    } catch (error) {
      throw error;
    }
  }
}
