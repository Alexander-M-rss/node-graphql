import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { rootMutation } from './mutation';
import { rootQuery } from './query';
import { graphqlBodySchema } from './schema';
import depthLimit = require('graphql-depth-limit');
import { Context } from './types/context';
import { createLoaders } from './loaders';

const DEPTH_LIMIT = 3;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const schema = new GraphQLSchema({
        query: rootQuery,
        mutation: rootMutation
      });
      const source = request.body.query || request.body.mutation || '';
      const variableValues = request.body.variables || {};
      const contextValue: Context = { fastify, ...createLoaders(fastify.db) };
      const validationErrors = validate(schema, parse(source), [depthLimit(DEPTH_LIMIT)]);

      if(validationErrors.length) {
        reply.send({errors: validationErrors});
      }

      return await graphql({ schema, source, variableValues, contextValue });
    },
  );
};

export default plugin;
