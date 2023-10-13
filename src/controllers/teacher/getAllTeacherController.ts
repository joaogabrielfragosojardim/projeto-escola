import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllTeacherUseCase } from '@/useCases/teacher/getAllTeachersUseCase';

export class GetAllTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
      });

      const { page, perPage } = getAllQuerySchema.parse(req.query);

      const getAllTeacherUseCase = new GetAllTeacherUseCase();

      const { data, meta } = await getAllTeacherUseCase.execute({
        page,
        perPage,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
