import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetOneProjectUseCase } from '@/useCases/project';

export class GetOneProjectController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneProjectUseCase = new GetOneProjectUseCase();

      const { project } = await getOneProjectUseCase.execute({ id: id[0] });

      return res.status(200).json({ project });
    } catch (error) {
      throw error;
    }
  }
}
