import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ValidateTeacherUseCase } from '@/useCases/teacher';

export class ValidateTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editBodySchema = z.object({
        teacherId: z.string().uuid(),
        validated: z.boolean(),
      });

      const { teacherId, validated } = editBodySchema.parse(req.body);

      const validateTeacherUseCase = new ValidateTeacherUseCase();

      const { teacher } = await validateTeacherUseCase.execute({
        teacherId,
        validated,
      });

      return res.status(200).json({ teacher });
    } catch (error) {
      throw error;
    }
  }
}
