import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { OptionsTeacherUseCase } from '@/useCases/teacher';

export class OptionsTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsQuerySchema = z.object({
        schoolId: z.string().uuid().optional(),
      });

      const { schoolId } = optionsQuerySchema.parse(req.query);

      const optionsTeacherUseCase = new OptionsTeacherUseCase();

      const { userId } = req;

      const { options } = await optionsTeacherUseCase.execute({
        schoolId,
        userId,
      });

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
