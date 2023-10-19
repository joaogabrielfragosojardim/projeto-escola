import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateClassUseCase } from '@/useCases/class';

export class CreateClassController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        session: z.string(),
        schoolId: z.string().uuid(),
        gradeId: z.string().uuid(),
        teacherId: z.string().uuid(),
      });

      const { name, schoolId, session, gradeId, teacherId } =
        createBodySchema.parse(req.body);

      const createClassUseCase = new CreateClassUseCase();

      const { classroom } = await createClassUseCase.execute({
        name,
        schoolId,
        session,
        gradeId,
        teacherId,
      });

      return res.status(201).json({ classroom });
    } catch (error) {
      throw error;
    }
  }
}
