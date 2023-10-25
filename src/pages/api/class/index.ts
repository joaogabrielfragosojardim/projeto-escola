import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  CreateClassController,
  GetAllClassController,
} from '@/controllers/class';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
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
  const createClassController = new CreateClassController();
  const getAllClassController = new GetAllClassController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      POST: createClassController.handle,
      GET: getAllClassController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
