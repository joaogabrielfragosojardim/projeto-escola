import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetAllAdmUseCase } from '@/useCases/adm/getAllAdmUseCase';

export class GetAllAdmController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        name: z.string().optional(),
      });
      const { page, perPage, name } = getAllQuerySchema.parse(req.query);

      const getAllAdmUseCase = new GetAllAdmUseCase();
      const { data, meta } = await getAllAdmUseCase.execute({
        page,
        perPage,
        name,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
