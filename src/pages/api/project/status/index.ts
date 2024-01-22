import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { ChangeProjectStatusController } from '@/controllers/project/changeProjectStatusController';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: true,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: [],
  PUT: ['administrator', 'master', 'coordinator', 'teacher'],
  DELETE: [],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const changeProjectStatusController = new ChangeProjectStatusController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      PUT: changeProjectStatusController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
