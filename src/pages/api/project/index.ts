import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreateProjectController } from '@/controllers/project/createProjectController';
import { GetAllProjectsController } from '@/controllers/project/getAllProjectController';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['master'],
  POST: [],
  PUT: [],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createProjectController = new CreateProjectController();
  const getAllProjectsController = new GetAllProjectsController();

  await RouteHandler(
    req,
    res,
    {
      POST: createProjectController.handle,
      GET: getAllProjectsController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
