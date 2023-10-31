import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllTeacherUseCase } from '@/useCases/teacher';

export class GetAllTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        name: z.string().optional(),
        schoolId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        period: z.enum(['Matutino', 'Vespertino', 'Noturno']).optional(),
        year: z.coerce.number().optional(),
      });

      const { userId } = req;

      const { page, perPage, name, period, year, projectId, schoolId } =
        getAllQuerySchema.parse(req.query);

      const getAllTeacherUseCase = new GetAllTeacherUseCase();

      const { data, meta } = await getAllTeacherUseCase.execute({
        page,
        perPage,
        userId,
        name,
        period,
        year,
        projectId,
        schoolId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
