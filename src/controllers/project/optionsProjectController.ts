import type { NextApiRequest, NextApiResponse } from 'next';

import { OptionsProjectUseCase } from '@/useCases/project';

export class OptionsProjectController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsProjectUseCase = new OptionsProjectUseCase();
      const { userId } = req;

      const { options } = await optionsProjectUseCase.execute({ userId });

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
