import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllStudentUseCase } from '@/useCases/student';

export class GetAllStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        classId: z.string().uuid().optional(),
        schoolId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),
      });

      const { page, perPage, classId, projectId, schoolId, teacherId } =
        getAllQuerySchema.parse(req.query);

      const getAllStudentUseCase = new GetAllStudentUseCase();

      const { data, meta } = await getAllStudentUseCase.execute({
        page,
        perPage,
        classId,
        projectId,
        schoolId,
        teacherId,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
