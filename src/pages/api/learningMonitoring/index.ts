import type { NextApiRequest, NextApiResponse } from 'next/types';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  CreateLearningMonitoringController,
  GetAllLearningMonitoringController,
} from '@/controllers/learningMonitoring';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: true,
  DELETE: false,
  PUT: false,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['teacher', 'master', 'administrator', 'coordinator'],
  POST: ['teacher'],
  PUT: [],
  DELETE: [],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const createlearningMonitoringController =
    new CreateLearningMonitoringController();
  const getAllLearningMonitoringController =
    new GetAllLearningMonitoringController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      POST: createlearningMonitoringController.handle,
      GET: getAllLearningMonitoringController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
