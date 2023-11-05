import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import { CreateLearningMonitoringController } from '@/controllers/learningMonitoring';
import type { Role } from '@/types/roles';

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
  res: NextApiResponse,
) {
  const createlearningMonitoringController =
    new CreateLearningMonitoringController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      POST: createlearningMonitoringController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
