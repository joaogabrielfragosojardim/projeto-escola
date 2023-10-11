import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreateCoordinatorController } from '@/controllers/coordinator/createCoordinatorController';
import { GetAllCoordinatorController } from '@/controllers/coordinator/getAllCoordinatorController';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createCoordinatorController = new CreateCoordinatorController();
  const getAllCoordinatorController = new GetAllCoordinatorController();
  await RouteHandler(
    req,
    res,
    {
      POST: createCoordinatorController.handle,
      GET: getAllCoordinatorController.handle,
    },
    authMethods[method],
  );
}
