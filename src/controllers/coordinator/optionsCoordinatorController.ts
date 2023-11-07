import type { NextApiRequest, NextApiResponse } from 'next';

import { OptionsCoordinatorUseCase } from '@/useCases/coordinator/optionsCoordinatorUseCase';

export class OptionsCoordinatorController {
  async handle(_: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsCoordinatorUseCase = new OptionsCoordinatorUseCase();

      const { options } = await optionsCoordinatorUseCase.execute();

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
