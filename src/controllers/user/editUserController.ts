import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { EditUserUseCase } from '@/useCases/user';

export class EditUserController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { userId } = req;

      const editBodySchema = z.object({
        name: z.string(),
        password: z.string().optional(),
        visualIdentity: z.string().optional(),
      });

      const { name, password, visualIdentity } = editBodySchema.parse(req.body);

      const editUserUseCase = new EditUserUseCase();

      const { user } = await editUserUseCase.execute({
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
