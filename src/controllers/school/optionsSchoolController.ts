import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { OptionsSchoolUseCase } from '@/useCases/school';

export class OptionsSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsQuerySchema = z.object({
        projectId: z.string().uuid().optional(),
      });

      const { projectId } = optionsQuerySchema.parse(req.query);

      const optionsSchoolUseCase = new OptionsSchoolUseCase();

      const { options } = await optionsSchoolUseCase.execute({ projectId });

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
