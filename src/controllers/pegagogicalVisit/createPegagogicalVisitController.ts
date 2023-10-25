import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { CreatePegagogicalVisitUseCase } from '@/useCases/pegagogicalVisit';

export class CreatePegagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        date: z.coerce.date(),
        frequency: z.number(),
        observations: z.string(),
        questions: z.record(z.any(), z.any()),
        schoolId: z.string().uuid(),
        classId: z.string().uuid(),
        coordinatorId: z.string().uuid(),
      });

      const {
        date,
        frequency,
        observations,
        questions,
        classId,
        coordinatorId,
        schoolId,
      } = createBodySchema.parse(req.body);

      const createPegagogicalVisitUseCase = new CreatePegagogicalVisitUseCase();

      const { pegagogicalVisit } = await createPegagogicalVisitUseCase.execute({
        date,
        frequency,
        observations,
        questions,
        classId,
        coordinatorId,
        schoolId,
      });

      return res.status(201).json(pegagogicalVisit);
    } catch (error) {
      throw error;
    }
  }
}
