import { HttpMethod, RouteHandler } from '@/components/api/RouteHandler';
import { CreateUserController } from '@/controllers/user';


import { NextApiRequest, NextApiResponse } from 'next';

const authMethods: Record<HttpMethod, boolean> = {
  GET: false,
  POST: true,
  DELETE: false,
  PUT: false,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method as HttpMethod;

  const createUserController = new CreateUserController();

  await RouteHandler(
    req,
    res,
    {
      POST: createUserController.handle,
    },
    authMethods[method]
  );
}
