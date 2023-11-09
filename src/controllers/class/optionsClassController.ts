import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { OptionsClassUseCase } from '@/useCases/class';

export class OptionsClassController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsQuerySchema = z.object({
        schoolId: z.string().uuid().optional(),
      });

      const { schoolId } = optionsQuerySchema.parse(req.query);

      const optionsClassUseCase = new OptionsClassUseCase();

      const { userId } = req;

      const { options } = await optionsClassUseCase.execute({
        schoolId,
        userId,
      });

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
