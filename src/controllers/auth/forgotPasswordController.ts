import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ForgotPasswordUseCase } from '@/useCases/auth';

export class ForgotPasswordController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const forgotPasswordBodySchema = z.object({
        email: z.string().email(),
      });

      const { email } = forgotPasswordBodySchema.parse(req.body);

      const forgotPasswordUseCase = new ForgotPasswordUseCase();

      await forgotPasswordUseCase.execute({
        email,
      });

      return res.status(200).json({ message: 'E-mail enviado com sucesso' });
    } catch (error) {
      throw error;
    }
  }
}
