import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  DeleteCooordinatorController,
  EditCoordinatorController,
  GetOneCoordinatorController,
} from '@/controllers/coordinator';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: true,
  PUT: true,
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
  const getOneCoordinatorController = new GetOneCoordinatorController();
  const deleteCooordinatorController = new DeleteCooordinatorController();
  const editCoordinatorController = new EditCoordinatorController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneCoordinatorController.handle,
      DELETE: deleteCooordinatorController.handle,
      PUT: editCoordinatorController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
