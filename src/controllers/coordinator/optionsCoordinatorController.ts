import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { OptionsCoordinatorUseCase } from '@/useCases/coordinator/optionsCoordinatorUseCase';

export class OptionsCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsQuerySchema = z.object({
        projectId: z.string().uuid().optional(),
        schoolId: z.string().uuid().optional(),
      });

      const { schoolId, projectId } = optionsQuerySchema.parse(req.query);

      const optionsCoordinatorUseCase = new OptionsCoordinatorUseCase();

      const { options } = await optionsCoordinatorUseCase.execute({
        schoolId,
        projectId,
      });

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
