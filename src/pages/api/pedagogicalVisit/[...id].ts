import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { GetOnePegagogicalVisitController } from '@/controllers/pegagogicalVisit';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: false,
  PUT: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['coordinator', 'administrator', 'master'],
  POST: [],
  PUT: [],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const getOnePegagogicalVisitController =
    new GetOnePegagogicalVisitController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOnePegagogicalVisitController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
