import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { OptionsStudentUseCase } from '@/useCases/student';

export class OptionsStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsQuerySchema = z.object({
        classId: z.string().uuid().optional(),
        schoolId: z.string().uuid().optional(),
        projectId: z.string().uuid().optional(),
        teacherId: z.string().uuid().optional(),
        period: z.string().optional(),
        year: z.string().optional(),
        coordinatorId: z.string().uuid().optional(),
      });

      const {
        projectId,
        classId,
        schoolId,
        teacherId,
        period,
        coordinatorId,
        year,
      } = optionsQuerySchema.parse(req.query);

      const { userId } = req;

      const optionsStudentUseCase = new OptionsStudentUseCase();

      const { options } = await optionsStudentUseCase.execute({
        projectId,
        classId,
        schoolId,
        teacherId,
        userId,
        period,
        coordinatorId,
        year,
      });

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
