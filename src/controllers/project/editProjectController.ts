import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { EditProjectUseCase } from '@/useCases/editProjectUseCase';

export class EditProjectController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const editBodySchema = z.object({
        name: z.string(),
        visualIdentity: z.string(),
        about: z.string(),
      });

      const { id } = editQuerySchema.parse(req.query);
      const { name, about, visualIdentity } = editBodySchema.parse(req.body);

      const editProjectUseCase = new EditProjectUseCase();

      const { project } = await editProjectUseCase.execute({
        id: id[0],
        name,
        about,
        visualIdentity,
      });

      return res.status(200).json({ project });
    } catch (error) {
      throw error;
    }
  }
}
