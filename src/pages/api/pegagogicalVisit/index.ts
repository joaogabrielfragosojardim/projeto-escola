import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreatePegagogicalVisitController } from '@/controllers/pegagogicalVisit';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: true,
  DELETE: false,
  PUT: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: ['coordinator', 'administrator', 'master'],
  PUT: [],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createPegagogicalVisitController =
    new CreatePegagogicalVisitController();

  await RouteHandler(
    req,
    res,
    {
      POST: createPegagogicalVisitController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
