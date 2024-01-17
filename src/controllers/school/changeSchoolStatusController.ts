import type { NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';

import { ChangeSchoolStatusUseCase } from '@/useCases/school/changeSchoolStatusUseCase';

export class ChangeCoordinatorStatusController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const editBodySchema = z.object({
        schoolId: z.string().uuid(),
        status: z.boolean(),
      });

      const { schoolId, status } = editBodySchema.parse(req.body);

      const changeSchoolStatus = new ChangeSchoolStatusUseCase();

      const { school } = await changeSchoolStatus.execute({
        schoolId,
        status,
      });

      return res.status(200).json({ school });
    } catch (error) {
      throw error;
    }
  }
}
