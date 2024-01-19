import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { GetOneClassController } from '@/controllers/class';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
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
  const getOneClassController = new GetOneClassController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneClassController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
