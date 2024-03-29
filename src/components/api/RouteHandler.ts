import type { NextApiRequest, NextApiResponse } from 'next/types';
import { ZodError } from 'zod';

import { AppError } from '@/errors';

import { permissions } from './permissions';
import { verifyJWT } from './verifyJWT';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
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
  roles?: string[],
) => {
  try {
    if (auth) {
      await verifyJWT(request, response);
    }

    if (roles?.length) {
      await permissions(request, response, roles);
    }

    const method = request.method as HttpMethod;
    if (method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Credentials', 'true');
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET,DELETE,PATCH,POST,PUT,OPTIONS',
      );
      response.setHeader('Access-Control-Allow-Headers', '*');
      return response.status(200).send('');
    }

    const handler = handlers[method];

    if (!handler) {
      return response.status(405).send('Method not allowed');
    }

    await handler!(request, response);
  } catch (error) {
    console.log(error);
    if (error instanceof AppError) {
      return response.status(error.status).send({ message: error.message });
    }

    if (error instanceof ZodError) {
      return response.status(400).send({ message: error.format() });
    }
    return response.status(500).json({ message: 'Erro desconhecido.' });
  }
};
