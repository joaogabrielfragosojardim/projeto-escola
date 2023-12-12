import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateStudentUseCase } from '@/useCases/student';

export class CreateStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        visualIdentity: z.string().optional(),
        birtday: z.coerce.date(),
        schoolId: z.string().uuid(),
        classId: z.string().uuid(),
      });

      const {
        name,
        email,
        password,
        schoolId,
        birtday,
        visualIdentity,
        classId,
      } = createBodySchema.parse(req.body);

      const createStudentUseCase = new CreateStudentUseCase();

      const { student } = await createStudentUseCase.execute({
        name,
        email,
        password,
        schoolId,
        birtday,
        visualIdentity,
        classId,
      });

      return res.status(201).json({ student });
    } catch (error) {
      throw error;
    }
  }
}
