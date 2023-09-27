import { GetAllSchoolsUseCase } from '@/useCases/getAllSchoolsUseCase';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export class GetAllSchoolsController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.number().default(1),
        perPage: z.number().default(10),
      });

      const { page, perPage } = getAllQuerySchema.parse(req.query);

      const getAllSchoolsUseCase = new GetAllSchoolsUseCase();

      const { data, meta } = await getAllSchoolsUseCase.execute({
        page,
        perPage,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
