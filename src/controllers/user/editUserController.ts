import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditUserUseCase } from '@/useCases/editUserUseCase';

export class EditUserController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { userId } = req;

      const editBodySchema = z.object({
        name: z.string(),
      });

      const { name } = editBodySchema.parse(req.body);

      const editUserUseCase = new EditUserUseCase();

      const { user } = await editUserUseCase.execute({
        id: userId,
        name,
      });

      return res.status(200).json({ user });
    } catch (error) {
      throw error;
    }
  }
}
