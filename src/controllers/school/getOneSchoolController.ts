import { GetOneSchoolUseCase } from '@/useCases/getOneSchoolUseCase';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export class GetOneSchoolController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const getOneQuerySchema = z.object({
        id: z.array(z.string().uuid()),
      });

      const { id } = getOneQuerySchema.parse(req.query);

      const getOneSchoolUseCase = new GetOneSchoolUseCase();

      const { school } = await getOneSchoolUseCase.execute({ id: id[0] });

      return res.status(200).json({ school });
    } catch (error) {
      throw error;
    }
  }
}
