import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllSchoolsUseCase } from '@/useCases/school';

export class GetAllSchoolsController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        name: z.string().optional(),
        projectId: z.string().uuid().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        status: z.string().optional(),
      });

      const { page, perPage, name, projectId, city, state, status } =
        getAllQuerySchema.parse(req.query);

      const getAllSchoolsUseCase = new GetAllSchoolsUseCase();

      const { data, meta } = await getAllSchoolsUseCase.execute({
        page,
        perPage,
        name,
        projectId,
        city,
        state,
        status
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
