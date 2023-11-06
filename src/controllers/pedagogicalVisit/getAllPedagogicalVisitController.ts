import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetAllPedagogicalVisitsUseCase } from '@/useCases/pedagogicalVisit/getAllPedagogicalVisitUseCase';

export class GetAllPedagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
      });

      const { page, perPage } = getAllQuerySchema.parse(req.query);

      const getAllPedagogicalUseCase = new GetAllPedagogicalVisitsUseCase();

      const { data, meta } = await getAllPedagogicalUseCase.execute({
        page,
        perPage,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
