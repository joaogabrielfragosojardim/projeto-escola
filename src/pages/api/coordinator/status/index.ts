import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { ChangeCoordinatorStatusController } from '@/controllers/school/changeSchoolStatusController';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: true,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: [],
  PUT: ['administrator', 'master', 'coordinator', 'teacher'],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const changeCoordinatorStatusController =
    new ChangeCoordinatorStatusController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      PUT: changeCoordinatorStatusController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
