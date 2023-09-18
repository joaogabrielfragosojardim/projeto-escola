import { RegisterUseCase } from '@/useCases/register';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export async function register(req: NextApiRequest, res: NextApiResponse) {
  try {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      roleId: z.string().uuid(),
    });

    const { userId } = req.body

    const { name, email, password, roleId } = registerBodySchema.parse(
      req.body
    );

    const registerUseCase = new RegisterUseCase();

    const user = await registerUseCase.execute({
      name,
      email,
      password,
      roleId,
      userId
    });

    return res.status(201).json(user);
  } catch (error) {
    throw error;
  }
}
