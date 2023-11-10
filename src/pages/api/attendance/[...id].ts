import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  CreateAttendenceController,
  DeleteAttendenceController,
  EditAttendenceController,
  GetOneAttendenceController,
} from '@/controllers/attendence';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: true,
  PUT: true,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['teacher'],
  POST: ['teacher'],
  PUT: ['teacher'],
  DELETE: ['teacher'],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const createAttendenceController = new CreateAttendenceController();
  const deleteAttendenceController = new DeleteAttendenceController();
  const editAttendenceController = new EditAttendenceController();
  const getOneAttendenceController = new GetOneAttendenceController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneAttendenceController.handle,
      POST: createAttendenceController.handle,
      PUT: editAttendenceController.handle,
      DELETE: deleteAttendenceController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
