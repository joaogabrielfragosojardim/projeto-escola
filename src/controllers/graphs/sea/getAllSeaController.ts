import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetAllSeaUseCase } from './getAllSeaUseCase';

export class GetAllSeaController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllSeaSchema = z.object({
        teacherId: z.string().uuid().optional(),
        studentId: z.string().uuid().optional(),
        coordinatorId: z.string().uuid().optional(),
        schoolId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        startDate: z.coerce.date().optional(),
        finalDate: z.coerce.date().optional(),
        period: z.string().optional(),
        year: z.coerce.string().optional(),
      });

      const {
        period,
        year,
        startDate,
        finalDate,
        teacherId,
        coordinatorId,
        studentId,
        projectId,
        schoolId,
      } = getAllSeaSchema.parse(req.query);

      const getAllSeaUseCase = new GetAllSeaUseCase();

      const { data } = await getAllSeaUseCase.execute({
        period,
        year,
        startDate,
        finalDate,
        teacherId,
        coordinatorId,
        projectId,
        studentId,
        schoolId,
      });

      return res.status(200).json({ data });
    } catch (error) {
      throw error;
    }
  }
}
