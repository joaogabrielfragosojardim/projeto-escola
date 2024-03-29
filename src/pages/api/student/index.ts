import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  CreateStudentController,
  GetAllStudentController,
} from '@/controllers/student';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
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
  const createStudentController = new CreateStudentController();
  const getAllStudentController = new GetAllStudentController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      POST: createStudentController.handle,
      GET: getAllStudentController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
