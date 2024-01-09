import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { CreateLearningMonitoringUseCase } from '@/useCases/learningMonitoring';

export class CreateLearningMonitoringController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        writingLevel: z.string(),
        questions: z.record(z.any(), z.any()),
        studentId: z.string().uuid(),
        teacherId: z.string().uuid(),
      });

      const { writingLevel, questions, studentId, teacherId } =
        createBodySchema.parse(req.body);

      const createLearningMonitoringUseCase =
        new CreateLearningMonitoringUseCase();

      const { learningMonitoring } =
        await createLearningMonitoringUseCase.execute({
          writingLevel,
          questions,
          studentId,
          teacherId,
        });

      return res.status(201).json(learningMonitoring);
    } catch (error) {
      throw error;
    }
  }
}
