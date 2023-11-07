import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetAllLearningMonitoringUseCase } from '@/useCases/learningMonitoring';

export class GetAllLearningMonitoringController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        teacherId: z.string().uuid().optional(),

        startDate: z.coerce.date().optional(),
        finalDate: z.coerce.date().optional(),

        period: z.string().optional(),
        year: z.coerce.number().optional(),
      });

      const { page, perPage, period, year, startDate, finalDate, teacherId } =
        getAllQuerySchema.parse(req.query);

      const getAllLearningMonitoringUseCase =
        new GetAllLearningMonitoringUseCase();

      const { data, meta } = await getAllLearningMonitoringUseCase.execute({
        page,
        perPage,
        period,
        year,
        startDate,
        finalDate,
        teacherId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
