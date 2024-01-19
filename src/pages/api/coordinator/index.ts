import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  CreateCoordinatorController,
  GetAllCoordinatorController,
} from '@/controllers/coordinator';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['administrator', 'master'],
  POST: ['administrator', 'master'],
  PUT: [],
  DELETE: [],
  OPTIONS: [],
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
    permissionMethods[method],
  );
}
