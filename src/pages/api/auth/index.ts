import { RouteHandler } from '@/components/api/RouteHandler';
import { authenticate } from '@/controllers/user/authenticate';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await RouteHandler(
    req,
    res,
    {
      POST: authenticate,
    },
    false
  );
}
