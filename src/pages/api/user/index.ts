import { RouteHandler } from '@/components/api/RouteHandler';

import { register } from '@/controllers/user/register';
import { NextApiRequest, NextApiResponse } from 'next';

const auth: { [key: string]: boolean } = {
  POST: true,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await RouteHandler(
    req,
    res,
    {
      POST: register,
    },
    auth[req?.method || 'GET']
  );
}
