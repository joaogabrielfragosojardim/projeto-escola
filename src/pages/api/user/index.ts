import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreateUserController } from '@/controllers/user';
import { EditUserController } from '@/controllers/user/editUserController';
import { GetUserController } from '@/controllers/user/getUserController';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: true,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createUserController = new CreateUserController();
  const getUserController = new GetUserController();
  const editUserController = new EditUserController();

  await RouteHandler(
    req,
    res,
    {
      POST: createUserController.handle,
      GET: getUserController.handle,
      PUT: editUserController.handle,
    },
    authMethods[method],
  );
}
