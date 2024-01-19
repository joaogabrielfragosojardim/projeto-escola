import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { OptionsProjectController } from '@/controllers/project';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
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

  const optionsProjectController = new OptionsProjectController();

  await RouteHandler(
    req,
    res,
    {
      GET: optionsProjectController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
