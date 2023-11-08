import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { EditLearningMonitoringUseCase } from '@/useCases/learningMonitoring';

export class EditLearningMonitoringController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        writingLevel: z.string(),
        questions: z.record(z.any(), z.any()),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { writingLevel, questions } = editBodySchema.parse(req.body);

      const editLearningMonitoringUseCase = new EditLearningMonitoringUseCase();

      const { learningMonitoring } =
        await editLearningMonitoringUseCase.execute({
          id: id[0],
          writingLevel,
          questions,
        });

      return res.status(200).json({ learningMonitoring });
    } catch (error) {
      throw error;
    }
  }
}
