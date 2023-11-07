import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetOneLearningMonitogingUseCase } from '@/useCases/learningMonitoring';

export class GetOneLearningMonitoringController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneLearningMonitogingUseCase =
        new GetOneLearningMonitogingUseCase();

      const { learningMonitoring } =
        await getOneLearningMonitogingUseCase.execute({
          id: id[0],
        });

      return res.status(201).json(learningMonitoring);
    } catch (error) {
      throw error;
    }
  }
}
