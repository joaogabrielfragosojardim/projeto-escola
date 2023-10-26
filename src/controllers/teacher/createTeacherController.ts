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
        visualIdentity: z.string().url().optional(),
        telephone: z.string(),
        schoolId: z.string().uuid(),
        coordinatorId: z.string().uuid(),
      });

      const {
        name,
        email,
        password,
        schoolId,
        telephone,
        coordinatorId,
        visualIdentity,
      } = createBodySchema.parse(req.body);

      const createTeacherUseCase = new CreateTeacherUseCase();

      const { teacher } = await createTeacherUseCase.execute({
        name,
        email,
        password,
        schoolId,
        telephone,
        coordinatorId,
        visualIdentity,
      });

      return res.status(201).json({ teacher });
    } catch (error) {
      throw error;
    }
  }
}
