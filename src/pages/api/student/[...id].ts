import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  EditStudentController,
  GetOneStudentController,
} from '@/controllers/student';
import { DeleteStudentController } from '@/controllers/student/deleteStudentController';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: true,
  PUT: true,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: [],
  PUT: [],
  DELETE: [],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const getOneStudentController = new GetOneStudentController();
  const editStudentController = new EditStudentController();
  const deleteStudentController = new DeleteStudentController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneStudentController.handle,
      PUT: editStudentController.handle,
      DELETE: deleteStudentController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
