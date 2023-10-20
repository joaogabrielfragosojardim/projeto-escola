import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ChangeStudentStatusUseCase } from '@/useCases/student';

export class ChangeStudentStatusController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editBodySchema = z.object({
        studentId: z.string().uuid(),
        status: z.boolean(),
      });

      const { studentId, status } = editBodySchema.parse(req.body);

      const changeStudentStatusUseCase = new ChangeStudentStatusUseCase();

      const { student } = await changeStudentStatusUseCase.execute({
        studentId,
        status,
      });

      return res.status(200).json({ student });
    } catch (error) {
      throw error;
    }
  }
}
