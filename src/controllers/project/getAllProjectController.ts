import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { GetAllProjectsUseCase } from '@/useCases/project';

export class GetAllProjectsController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        name: z.string().optional(),
      });

      const { page, perPage, name } = getAllQuerySchema.parse(req.query);

      const getAllProjectsUseCase = new GetAllProjectsUseCase();

      const { data, meta } = await getAllProjectsUseCase.execute({
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
