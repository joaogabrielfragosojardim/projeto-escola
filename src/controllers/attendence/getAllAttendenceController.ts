import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetAllAttendenceUseCase } from '@/useCases/attendence';

export class GetAllAttendenceController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        teacherId: z.string().uuid().optional(),
        studentId: z.string().uuid().optional(),

        startDate: z.coerce.date().optional(),
        finalDate: z.coerce.date().optional(),

        period: z.string().optional(),
        year: z.coerce.number().optional(),
      });

      const {
        page,
        perPage,
        period,
        year,
        startDate,
        finalDate,
        teacherId,
        studentId,
      } = getAllQuerySchema.parse(req.query);

      const getAllAttendenceUseCase = new GetAllAttendenceUseCase();

      const { userId } = req;

      const { data, meta } = await getAllAttendenceUseCase.execute({
        page,
        perPage,
        period,
        year,
        startDate,
        finalDate,
        teacherId,
        userId,
        studentId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
