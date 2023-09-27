import { EditSchoolUseCase } from '@/useCases/editSchoolUseCase';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export class EditSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        name: z.string(),
        city: z.string(),
        state: z.string(),
        projectId: z.string().uuid(),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { name, city, state, projectId } = editBodySchema.parse(req.body);

      const editSchoolUseCase = new EditSchoolUseCase();

      const { school } = await editSchoolUseCase.execute({
        id: id[0],
        name,
        city,
        state,
        projectId,
      });

      return res.status(200).json({ school });
    } catch (error) {
      throw error;
    }
  }
}
