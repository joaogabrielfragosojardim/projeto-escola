import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ChangeCoordinatorStatusUseCase } from '@/useCases/coordinator/changCoordinatorStatusUseCase';

export class ChangeCoordinatorStatusController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editBodySchema = z.object({
        coordinatorId: z.string().uuid(),
        status: z.boolean(),
      });

      const { coordinatorId, status } = editBodySchema.parse(req.body);

      const changeCoordinatorStatus = new ChangeCoordinatorStatusUseCase();

      const { coordinator } = await changeCoordinatorStatus.execute({
        coordinatorId,
        status,
      });

      return res.status(200).json({ coordinator });
    } catch (error) {
      throw error;
    }
  }
}
