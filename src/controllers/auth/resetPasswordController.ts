import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ResetPasswordUseCase } from '@/useCases/auth';

export class ResetPasswordController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const resetPasswordBodySchema = z.object({
        token: z.string().uuid(),
        password: z.string().min(6),
      });

      const { token, password } = resetPasswordBodySchema.parse(req.body);

      const resetPasswordUseCase = new ResetPasswordUseCase();

      await resetPasswordUseCase.execute({ token, password });

      return res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      throw error;
    }
  }
}
