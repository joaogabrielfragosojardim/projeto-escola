import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { EditPedagogicalVisitUseCase } from '@/useCases/pedagogicalVisit';

export class EditPedagogicalVisitController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        date: z.coerce.date(),
        frequency: z.number(),
        observations: z.string(),
        questions: z.record(z.any(), z.any()),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { date, frequency, observations, questions } = editBodySchema.parse(
        req.body,
      );

      const editPedagogicalVisitUseCase = new EditPedagogicalVisitUseCase();

      const { pedagogicalVisit } = await editPedagogicalVisitUseCase.execute({
        id: id[0],
        date,
        frequency,
        observations,
        questions,
      });

      return res.status(200).json({ pedagogicalVisit });
    } catch (error) {
      throw error;
    }
  }
}
