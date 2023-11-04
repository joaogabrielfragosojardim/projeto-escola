import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { ForgotPasswordController } from '@/controllers/auth';
import type { Role } from '@/types/roles';

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
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const forgotPasswordController = new ForgotPasswordController();

  await RouteHandler(
    req,
    res,
    {
      POST: forgotPasswordController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
