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
        visualIdentity: z.string().optional(),
        telephone: z.string(),
        schoolId: z.string().uuid(),
        classRooms: z.array(z.object({ period: z.string(), year: z.number() })),
      });

      const {
        name,
        email,
        password,
        schoolId,
        telephone,
        visualIdentity,
        classRooms,
      } = createBodySchema.parse(req.body);

      const createTeacherUseCase = new CreateTeacherUseCase();

      const { teacher } = await createTeacherUseCase.execute({
        name,
        email,
        password,
        schoolId,
        telephone,
        visualIdentity,
        classRooms,
      });

      return res.status(201).json({ teacher });
    } catch (error) {
      throw error;
    }
  }
}
