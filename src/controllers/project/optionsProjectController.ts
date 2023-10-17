import type { NextApiRequest, NextApiResponse } from 'next';

import { OptionsProjectUseCase } from '@/useCases/project';

export class OptionsProjectController {
  async handle(_: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsProjectUseCase = new OptionsProjectUseCase();

      const { options } = await optionsProjectUseCase.execute();

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
