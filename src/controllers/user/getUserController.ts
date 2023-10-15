import type { NextApiRequest, NextApiResponse } from 'next/types';

import { GetUserUseCase } from '@/useCases/user';

export class GetUserController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { userId } = req;

      const getUserUseCase = new GetUserUseCase();

      const user = await getUserUseCase.execute({
        id: userId,
      });

      return res.status(201).json(user);
    } catch (error) {
      throw error;
    }
  }
}
