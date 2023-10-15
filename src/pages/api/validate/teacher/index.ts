import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { ValidateTeacherController } from '@/controllers/teacher/validateTeacherController';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: false,
  DELETE: false,
  PUT: true,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method as HttpMethod;

  const validateTeacherController = new ValidateTeacherController();

  await RouteHandler(
    req,
    res,
    {
      PUT: validateTeacherController.handle,
    },
    authMethods[method],
  );
}
