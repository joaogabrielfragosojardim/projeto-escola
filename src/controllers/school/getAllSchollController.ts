import { GetAllSchoolsUseCase } from '@/useCases/getAllSchoolsUseCase';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export class GetAllSchoolsController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getAllQuerySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
        name: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
      });

      const { page, perPage, name, city, state } = getAllQuerySchema.parse(
        req.query
      );

      const getAllSchoolsUseCase = new GetAllSchoolsUseCase();

      const { data, meta } = await getAllSchoolsUseCase.execute({
        page,
        perPage,
        name,
        city,
        state,
      });

      return res.status(200).json({ data, meta });
    } catch (error) {
      throw error;
    }
  }
}
