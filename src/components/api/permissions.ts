import type { NextApiRequest, NextApiResponse } from 'next/types';

import { prisma } from '@/lib/prisma';

export const permissions = async (
  req: NextApiRequest,
  res: NextApiResponse,
  roles: string[],
) => {
  const { userId } = req;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user) {
    return res.status(400).json({ message: 'Usuário inexistente' });
  }
  const permissionExists = roles.includes(user.role.name);

  if (!permissionExists) {
    return res
      .status(403)
      .json({ message: 'Você não tem permissão para acessar essa rota' });
  }
};
