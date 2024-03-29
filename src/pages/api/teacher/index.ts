import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  CreateTeacherController,
  GetAllTeacherController,
} from '@/controllers/teacher';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
  OPTIONS: false,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const createTeacherController = new CreateTeacherController();
  const getAllTeacherController = new GetAllTeacherController();

  await RouteHandler(
    req,
    res,
    {
      POST: createTeacherController.handle,
      GET: getAllTeacherController.handle,
    },
    authMethods[method],
  );
}
