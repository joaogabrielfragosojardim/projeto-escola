import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllStudentUseCase } from '@/useCases/student';

export class GetAllStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        year: z.coerce.number().optional(),
        period: z.string().optional(),
        schoolId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),
        name: z.string().optional(),
        status: z.string().optional(),
      });

      const {
        page,
        perPage,
        year,
        period,
        projectId,
        schoolId,
        teacherId,
        name,
        status,
      } = getAllQuerySchema.parse(req.query);

      const { userId } = req;

      const getAllStudentUseCase = new GetAllStudentUseCase();

      const { data, meta } = await getAllStudentUseCase.execute({
        page,
        perPage,
        year,
        period,
        projectId,
        schoolId,
        teacherId,
        name,
        status,
        userId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
