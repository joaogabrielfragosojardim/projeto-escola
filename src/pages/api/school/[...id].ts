import { HttpMethod, RouteHandler } from '@/components/api/RouteHandler';
import {
  DeleteSchoolController,
  EditSchoolController,
  GetOneSchoolController,
} from '@/controllers/school';

import { Role } from '@/types/roles';

import { NextApiRequest, NextApiResponse } from 'next';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: true,
  PUT: true,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['master', 'administrator'],
  POST: [],
  PUT: ['master', 'administrator'],
  DELETE: ['master', 'administrator'],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getOneSchoolsController = new GetOneSchoolController();
  const deleteSchoolController = new DeleteSchoolController();
  const editSchoolController = new EditSchoolController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneSchoolsController.handle,
      DELETE: deleteSchoolController.handle,
      PUT: editSchoolController.handle,
    },
    authMethods[method],
    permissionMethods[method]
  );
}
