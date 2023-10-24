import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllClassUseCase } from '@/useCases/class';

export class GetAllClassController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        schoolId: z.string().uuid().optional(),
        gradeId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),
      });

      const { page, perPage, schoolId, gradeId, teacherId } =
        getAllQuerySchema.parse(req.query);

      const getAllClassUseCase = new GetAllClassUseCase();

      const { data, meta } = await getAllClassUseCase.execute({
        page,
        perPage,
        schoolId,
        gradeId,
        teacherId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
