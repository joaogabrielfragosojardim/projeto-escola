import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetOneAdmUseCase } from '@/useCases/adm/getOneAdmUseCase';

export class GetOneAdmController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneAdmUseCase = new GetOneAdmUseCase();

      const { adm } = await getOneAdmUseCase.execute({
        id: id[0],
      });

      return res.status(200).json({ adm });
    } catch (error) {
      throw error;
    }
  }
}
