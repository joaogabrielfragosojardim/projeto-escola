import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { ChangeUserPasswordController } from '@/controllers/user';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: true,
  DELETE: false,
  PUT: false,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const changeUserPasswordController = new ChangeUserPasswordController();

  await RouteHandler(
    req,
    res,
    {
      POST: changeUserPasswordController.handle,
    },
    authMethods[method],
  );
}
