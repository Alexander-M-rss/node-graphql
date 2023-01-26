import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { rootQuery } from './query';
import { graphqlBodySchema } from './schema';

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
      });
      const source = request.body.query || request.body.mutation || '';
      const variableValues = request.body.variables || {};
      const contextValue = fastify;

      return await graphql({ schema, source, variableValues, contextValue });
    },
  );
};

export default plugin;
