import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreateAdmController } from '@/controllers/adm';
import { GetAllAdmController } from '@/controllers/adm/getAllAdmController';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['master'],
  POST: ['master'],
  PUT: [],
  DELETE: [],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;
  const createAdmController = new CreateAdmController();
  const getAllAdmController = new GetAllAdmController();

  await RouteHandler(
    req,
    res,
    {
      GET: getAllAdmController.handle,
      POST: createAdmController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
