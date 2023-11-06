import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetAllPedagogicalVisitsUseCase } from '@/useCases/pedagogicalVisit/getAllPedagogicalVisitUseCase';

export class GetAllPedagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        coordinatorId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),

        startDate: z.coerce.date().optional(),
        finalDate: z.coerce.date().optional(),

        period: z.string().optional(),
        year: z.coerce.number().optional(),
      });

      const {
        page,
        perPage,
        coordinatorId,
        period,
        year,
        startDate,
        finalDate,
        teacherId,
      } = getAllQuerySchema.parse(req.query);

      const getAllPedagogicalUseCase = new GetAllPedagogicalVisitsUseCase();

      const { data, meta } = await getAllPedagogicalUseCase.execute({
        page,
        perPage,
        coordinatorId,
        period,
        year,
        startDate,
        finalDate,
        teacherId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
