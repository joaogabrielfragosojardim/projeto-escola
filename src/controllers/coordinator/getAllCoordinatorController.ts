import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { GetAllCoordinatorsUseCase } from '@/useCases/coordinator';

export class GetAllCoordinatorController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        name: z.string().optional(),
        projectId: z.string().optional(),
        schoolId: z.string().optional(),
        status: z.string().optional(),
      });

      const { page, perPage, name, projectId, schoolId, status } =
        getAllQuerySchema.parse(req.query);

      const getAllCoordinatorsUseCase = new GetAllCoordinatorsUseCase();

      const { data, meta } = await getAllCoordinatorsUseCase.execute({
        page,
        perPage,
        name,
        projectId,
        schoolId,
        status,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
