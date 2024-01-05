import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ChangeProjectStatusUseCase } from '@/useCases/project/changeProjectStatusUseCase';

export class ChangeProjectStatusController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editBodySchema = z.object({
        projectId: z.string().uuid(),
        status: z.boolean(),
      });

      const { projectId, status } = editBodySchema.parse(req.body);

      const changeProjectStatusUseCase = new ChangeProjectStatusUseCase();

      const { project } = await changeProjectStatusUseCase.execute({
        projectId,
        status,
      });

      return res.status(200).json({ project });
    } catch (error) {
      throw error;
    }
  }
}
