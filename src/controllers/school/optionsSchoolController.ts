import type { NextApiRequest, NextApiResponse } from 'next';

import { OptionsSchoolUseCase } from '@/useCases/school';

export class OptionsSchoolController {
  async handle(_: NextApiRequest, res: NextApiResponse) {
    try {
      const optionsSchoolUseCase = new OptionsSchoolUseCase();

      const { options } = await optionsSchoolUseCase.execute();

      return res.status(200).json({ options });
    } catch (error) {
      throw error;
    }
  }
}
