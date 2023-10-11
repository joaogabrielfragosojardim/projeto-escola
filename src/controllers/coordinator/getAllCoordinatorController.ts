import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllCoordinatorsUseCase } from '@/useCases/getAllCoordinatorsUseCase';

export class GetAllCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
      });

      const { page, perPage } = getAllQuerySchema.parse(req.query);

      const getAllCoordinatorsUseCase = new GetAllCoordinatorsUseCase();

      const { data, meta } = await getAllCoordinatorsUseCase.execute({
        page,
        perPage,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
