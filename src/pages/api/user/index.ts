import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreateUserController } from '@/controllers/user';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: true,
  DELETE: false,
  PUT: false,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createUserController = new CreateUserController();

  await RouteHandler(
    req,
    res,
    {
      POST: createUserController.handle,
    },
    authMethods[method],
  );
}
