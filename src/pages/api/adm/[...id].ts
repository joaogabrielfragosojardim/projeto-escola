import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreateAdmController } from '@/controllers/adm';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: false,
  DELETE: true,
  PUT: true,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: [],
  PUT: ['administrator', 'master'],
  DELETE: ['administrator', 'master'],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createAdmController = new CreateAdmController();

  await RouteHandler(
    req,
    res,
    {
      POST: createAdmController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
