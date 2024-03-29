import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreatePedagogicalVisitController } from '@/controllers/pedagogicalVisit';
import { GetAllPedagogicalVisitController } from '@/controllers/pedagogicalVisit/getAllPedagogicalVisitController';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['coordinator', 'administrator', 'master'],
  POST: ['coordinator'],
  PUT: [],
  DELETE: [],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createPedagogicalVisitController =
    new CreatePedagogicalVisitController();
  const getAllPedagogicalVisitController =
    new GetAllPedagogicalVisitController();

  await RouteHandler(
    req,
    res,
    {
      GET: getAllPedagogicalVisitController.handle,
      POST: createPedagogicalVisitController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
