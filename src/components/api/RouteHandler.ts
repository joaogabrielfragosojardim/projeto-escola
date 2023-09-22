import { NextApiRequest, NextApiResponse } from 'next';

import { verifyJWT } from './verifyJWT';
import { AppError } from '@/errors';
import { ZodError } from 'zod';
import { permissions } from './permissions';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type HttpHandler = (request: NextApiRequest, response: NextApiResponse) => void;

interface RouteHandlerParams {
  GET?: HttpHandler;
  POST?: HttpHandler;
  PUT?: HttpHandler;
  DELETE?: HttpHandler;
}

export const RouteHandler = async (
  request: NextApiRequest,
  response: NextApiResponse,
  handlers: RouteHandlerParams,
  auth?: boolean,
  roles?: string[]
) => {
  try {
    if (auth) {
      verifyJWT(request, response);
    }

    if (roles) {
      permissions(request, response, roles);
    }

    const method = request.method as HttpMethod;
    const handler = handlers[method];

    if (!handler) {
      return response.status(405).send('Method not allowed');
    }

    return await handler!(request, response);
  } catch (error) {
    if (error instanceof AppError) {
      return response.status(error.status).send({ message: error.message });
    }

    if (error instanceof ZodError) {
      return response.status(400).send({ message: error.format() });
    }

    return response.status(500).json({ message: 'Erro desconhecido.' });
  }
};
