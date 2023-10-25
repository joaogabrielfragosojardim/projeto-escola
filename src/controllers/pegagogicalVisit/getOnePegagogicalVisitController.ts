import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetOnePegagogicalVisitUseCase } from '@/useCases/pegagogicalVisit';

export class GetOnePegagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOnePegagogicalVisitUseCase = new GetOnePegagogicalVisitUseCase();

      const { pegagogicalVisit } = await getOnePegagogicalVisitUseCase.execute({
        id: id[0],
      });

      return res.status(200).json({ pegagogicalVisit });
    } catch (error) {
      throw error;
    }
  }
}
