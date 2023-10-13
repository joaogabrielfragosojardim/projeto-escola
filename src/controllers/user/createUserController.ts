import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { CreateUserUseCase } from '@/useCases/user';

export class CreateUserController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        roleId: z.string().uuid(),
      });

      const { userId: creatorId } = req;

      const { name, email, password, roleId } = registerBodySchema.parse(
        req.body,
      );

      const createUserUseCase = new CreateUserUseCase();

      const user = await createUserUseCase.execute({
        name,
        email,
        password,
        roleId,
        creatorId,
      });

      return res.status(201).json(user);
    } catch (error) {
      throw error;
    }
  }
}
