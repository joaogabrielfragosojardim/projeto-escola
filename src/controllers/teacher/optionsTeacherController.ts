import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { OptionsTeacherUseCase } from '@/useCases/teacher';

export class OptionsTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsQuerySchema = z.object({
        projectId: z.string().uuid().optional(),
        schoolId: z.string().uuid().optional(),
        coordinatorId: z.string().uuid().optional(),
      });

      const { projectId, schoolId, coordinatorId } = optionsQuerySchema.parse(
        req.query,
      );

      const optionsTeacherUseCase = new OptionsTeacherUseCase();

      const { userId } = req;

      const { options } = await optionsTeacherUseCase.execute({
        projectId,
        schoolId,
        coordinatorId,
        userId,
      });

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
