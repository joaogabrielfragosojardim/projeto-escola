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
        schoolId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),
        startDate: z.coerce.date().optional(),
        finalDate: z.coerce.date().optional(),
        period: z.string().optional(),
        year: z.coerce.string().optional(),
      });

      const {
        page,
        perPage,
        coordinatorId,
        schoolId,
        projectId,
        period,
        year,
        startDate,
        finalDate,
        teacherId,
      } = getAllQuerySchema.parse(req.query);

      const { userId } = req;

      const getAllPedagogicalUseCase = new GetAllPedagogicalVisitsUseCase();

      const { data, meta } = await getAllPedagogicalUseCase.execute({
        page,
        perPage,
        coordinatorId,
        schoolId,
        period,
        year,
        startDate,
        finalDate,
        teacherId,
        projectId,
        userId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
