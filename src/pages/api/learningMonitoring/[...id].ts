import type { NextApiRequest, NextApiResponse } from 'next';

import type { HttpMethod } from '@/components/api/RouteHandler';
import { RouteHandler } from '@/components/api/RouteHandler';
import {
  DeleteLearningMonitoringController,
  EditLearningMonitoringController,
  GetOneLearningMonitoringController,
} from '@/controllers/learningMonitoring';
import type { Role } from '@/types/roles';

const authMethods: Record<HttpMethod, boolean> = {
  GET: true,
  POST: false,
  DELETE: true,
  PUT: true,
  OPTIONS: false,
};

const permissionMethods: Record<HttpMethod, Role[]> = {
  GET: ['teacher', 'master', 'administrator', 'coordinator'],
  POST: [],
  PUT: ['teacher', 'master', 'administrator', 'coordinator'],
  DELETE: ['teacher', 'master', 'administrator', 'coordinator'],
  OPTIONS: [],
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const getOneLearningMonitoringController =
    new GetOneLearningMonitoringController();

  const deleteLearningMonitoringController =
    new DeleteLearningMonitoringController();

  const editLearningMonitoringController =
    new EditLearningMonitoringController();

  const method = req.method as HttpMethod;

  await RouteHandler(
    req,
    res,
    {
      GET: getOneLearningMonitoringController.handle,
      DELETE: deleteLearningMonitoringController.handle,
      PUT: editLearningMonitoringController.handle,
    },
    authMethods[method],
    permissionMethods[method],
  );
}
