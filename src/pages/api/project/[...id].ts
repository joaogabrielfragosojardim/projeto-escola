import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  DeleteProjectController,
  EditProjectController,
  GetOneProjectController,
} from '@/controllers/project';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: true,
  PUT: true,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['master', 'administrator'],
  POST: [],
  PUT: ['master', 'administrator'],
  DELETE: ['master', 'administrator'],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const getOneProjectController = new GetOneProjectController();
  const deleteProjectController = new DeleteProjectController();
  const editProjectController = new EditProjectController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneProjectController.handle,
      DELETE: deleteProjectController.handle,
      PUT: editProjectController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
