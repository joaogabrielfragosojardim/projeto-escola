import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { DeleteAdmController } from '@/controllers/adm/deleteAdmController';
import { GetOneAdmController } from '@/controllers/adm/getOneAdmController';
import type { Role } from '@/types/roles';
import { EditAdmController } from '@/controllers/adm';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: true,
  PUT: true,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['administrator', 'master'],
  POST: [],
  PUT: ['administrator', 'master'],
  DELETE: ['administrator', 'master'],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const deleteAdmController = new DeleteAdmController();
  const getOneAdmController = new GetOneAdmController();
  const editAdmController = new EditAdmController()

  await RouteHandler(
    req,
    res,
    {
      GET: getOneAdmController.handle,
      DELETE: deleteAdmController.handle,
      PUT: editAdmController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
