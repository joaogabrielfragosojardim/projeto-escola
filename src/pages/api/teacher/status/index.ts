import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { ChangeTeacherStatusController } from '@/controllers/teacher';
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
  PUT: ['master', 'administrator', 'coordinator'],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const changeTeacherStatusController = new ChangeTeacherStatusController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      PUT: changeTeacherStatusController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
