import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { AuthenticateController } from '@/controllers/auth';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: false,
  DELETE: false,
  PUT: false,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: [],
  PUT: [],
  DELETE: [],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
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
    permissionMethods[method],
  );
}
