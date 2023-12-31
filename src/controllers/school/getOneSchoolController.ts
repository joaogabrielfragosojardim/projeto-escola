import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetOneSchoolUseCase } from '@/useCases/school';

export class GetOneSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneSchoolUseCase = new GetOneSchoolUseCase();

      const { school } = await getOneSchoolUseCase.execute({ id: id[0] });

      return res.status(200).json({ school });
    } catch (error) {
      throw error;
    }
  }
}
