import { HttpMethod, RouteHandler } from '@/components/api/RouteHandler';
import { CreateSchoolController, GetAllSchoolsController } from '@/controllers/school';

import { Role } from '@/types/roles';

import { NextApiRequest, NextApiResponse } from 'next';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: [],
  POST: ['master', 'administrator'],
  PUT: [],
  DELETE: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getAllSchoolsController = new GetAllSchoolsController();
  const createSchoolController = new CreateSchoolController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getAllSchoolsController.handle,
      POST: createSchoolController.handle,
    },
    authMethods[method],
    permissionMethods[method]
  );
}
