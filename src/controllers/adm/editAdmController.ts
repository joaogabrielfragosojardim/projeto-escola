import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditAdmUseCase } from '@/useCases/adm';

export class EditAdmController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { userId } = req;

      const editBodySchema = z.object({
        name: z.string(),
        password: z.string().optional(),
        visualIdentity: z.string().url().optional(),
      });

      const { name, password, visualIdentity } = editBodySchema.parse(req.body);

      const editAdmUseCase = new EditAdmUseCase();

      const { user } = await editAdmUseCase.execute({
        id: userId,
        name,
        password,
        visualIdentity,
      });

      return res.status(200).json({ user });
    } catch (error) {
      throw error;
    }
  }
}
