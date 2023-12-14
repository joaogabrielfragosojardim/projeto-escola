import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateStudentUseCase } from '@/useCases/student';

export class CreateStudentController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        visualIdentity: z.string().optional(),
        birtday: z.coerce.date(),
        schoolId: z.string().uuid(),
        classId: z.string().uuid(),
        registration: z.string(),
      });

      const { name, schoolId, birtday, visualIdentity, classId, registration } =
        createBodySchema.parse(req.body);

      const createStudentUseCase = new CreateStudentUseCase();

      const { student } = await createStudentUseCase.execute({
        name,
        schoolId,
        birtday,
        visualIdentity,
        classId,
        registration,
      });

      return res.status(201).json({ student });
    } catch (error) {
      throw error;
    }
  }
}
