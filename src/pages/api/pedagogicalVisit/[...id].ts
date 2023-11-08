import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  DeletePedagogicalVisitController,
  GetOnePedagogicalVisitController,
} from '@/controllers/pedagogicalVisit';
import { EditPedagogicalVisitController } from '@/controllers/pedagogicalVisit/editPedagogicalVisitController';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: false,
  PUT: true,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['coordinator', 'administrator', 'master'],
  POST: [],
  PUT: ['coordinator', 'administrator', 'master'],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const getOnePedagogicalVisitController =
    new GetOnePedagogicalVisitController();

  const deletePedagogicalVisitController =
    new DeletePedagogicalVisitController();

  const editPedagogicalVisitController = new EditPedagogicalVisitController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOnePedagogicalVisitController.handle,
      DELETE: deletePedagogicalVisitController.handle,
      PUT: editPedagogicalVisitController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
