import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  DeleteTeacherController,
  EditTeacherController,
  GetOneTeacherController,
} from '@/controllers/teacher';
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
  const getOneCoordinatorController = new GetOneTeacherController();
  const deleteTeacherController = new DeleteTeacherController();
  const editTeacherController = new EditTeacherController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneCoordinatorController.handle,
      DELETE: deleteTeacherController.handle,
      PUT: editTeacherController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
