import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateTeacherUseCase } from '@/useCases/teacher';

export class CreateTeacherController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        telephone: z.string(),
        schoolId: z.string().uuid(),
        coordinatorId: z.string().uuid(),
      });

      const { name, email, password, schoolId, telephone, coordinatorId } =
        createBodySchema.parse(req.body);

      const createTeacherUseCase = new CreateTeacherUseCase();

      const { teacher } = await createTeacherUseCase.execute({
        name,
        email,
        password,
        schoolId,
        telephone,
        coordinatorId,
      });

      return res.status(201).json({ teacher });
    } catch (error) {
      throw error;
    }
  }
}
