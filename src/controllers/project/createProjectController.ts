import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { CreateProjectUseCase } from '@/useCases/createProjectUseCase';

export class CreateProjectController {
  async handle(req: NextApiRequest, res: NextApiResponse) {
    try {
      const createBodySchema = z.object({
        name: z.string(),
        about: z.string(),
        visualIdentity: z.record(z.string()),
      });

      const { name, about, visualIdentity } = createBodySchema.parse(req.body);

      const createProjectUseCase = new CreateProjectUseCase();

      const { project } = await createProjectUseCase.execute({
        name,
        about,
        visualIdentity,
      });

      return res.status(201).json(project);
    } catch (error) {
      throw error;
    }
  }
}
