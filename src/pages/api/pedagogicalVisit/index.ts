import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreatePedagogicalVisitController } from '@/controllers/pedagogicalVisit';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: true,
  DELETE: false,
  PUT: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: ['coordinator'],
  PUT: [],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createPedagogicalVisitController =
    new CreatePedagogicalVisitController();

  await RouteHandler(
    req,
    res,
    {
      POST: createPedagogicalVisitController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
