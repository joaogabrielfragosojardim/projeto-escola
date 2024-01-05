import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ChangeUserPasswordUseCase } from '@/useCases/user';

export class ChangeUserPasswordController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { userId } = req;

      const editBodySchema = z.object({
        oldPassword: z.string().min(8),
        newPassword: z.string().min(8),
        confirmNewPassword: z.string().min(8),
      });

      const { oldPassword, newPassword, confirmNewPassword } =
        editBodySchema.parse(req.body);

      const changeUserPasswordUseCase = new ChangeUserPasswordUseCase();

      const { user } = await changeUserPasswordUseCase.execute({
        userId,
        oldPassword,
        newPassword,
        confirmNewPassword,
      });

      return res.status(200).json({ user });
    } catch (error) {
      throw error;
    }
  }
}
