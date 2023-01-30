import { FastifyInstance } from 'fastify';
import { createLoaders } from '../loaders';

export type Context = ReturnType<typeof createLoaders> & {
  fastify: FastifyInstance;
};