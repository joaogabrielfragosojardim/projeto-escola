import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { ChangeStudentStatusController } from '@/controllers/student';
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
  const changeStudentStatusController = new ChangeStudentStatusController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      PUT: changeStudentStatusController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
