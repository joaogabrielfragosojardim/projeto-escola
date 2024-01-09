import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { CreatePedagogicalVisitUseCase } from '@/useCases/pedagogicalVisit';

export class CreatePedagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        date: z.coerce.date(),
        frequency: z.number(),
        observations: z.string(),
        questions: z.record(z.any(), z.any()),
        classId: z.string().uuid(),
        coordinatorId: z.string().uuid(),
        teacherId: z.string().uuid(),
      });

      const {
        date,
        frequency,
        observations,
        questions,
        classId,
        coordinatorId,
        teacherId,
      } = createBodySchema.parse(req.body);

      const createPedagogicalVisitUseCase = new CreatePedagogicalVisitUseCase();

      const { pedagogicalVisit } = await createPedagogicalVisitUseCase.execute({
        date,
        frequency,
        observations,
        questions,
        classId,
        coordinatorId,
        teacherId,
      });

      return res.status(201).json(pedagogicalVisit);
    } catch (error) {
      throw error;
    }
  }
}
