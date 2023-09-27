import { HttpMethod, RouteHandler } from '@/components/api/RouteHandler';
import { AuthenticateController } from '@/controllers/auth';
import { Role } from '@/types/roles';

import type { NextApiRequest, NextApiResponse } from 'next';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: false,
  DELETE: false,
  PUT: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: [],
  PUT: [],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method as HttpMethod;

  const authenticateController = new AuthenticateController();

  await RouteHandler(
    req,
    res,
    {
      POST: authenticateController.handle,
    },
    authMethods[method],
    permissionMethods[method]
  );
}
