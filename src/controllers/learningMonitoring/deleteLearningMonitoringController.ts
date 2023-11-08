import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { DeleteLearningMonitoringUseCase } from '@/useCases/learningMonitoring';

export class DeleteLearningMonitoringController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const deleteQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = deleteQuerySchema.parse(req.query);

      const deleteLearningMonitoringUseCase =
        new DeleteLearningMonitoringUseCase();

      await deleteLearningMonitoringUseCase.execute({ id: id[0] });

      return res.status(204).end();
    } catch (error) {
      throw error;
    }
  }
}
