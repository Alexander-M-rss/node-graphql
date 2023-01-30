import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {

    return  await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({key: 'id', equals: request.params.id});

      if (!profile) {
        throw fastify.httpErrors.notFound('Post not found');
      }

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      if (!(await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId }))) {
          throw fastify.httpErrors.badRequest('Member type not found');
      }
      if (await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId })) {
          throw fastify.httpErrors.badRequest('User profile already exists');
      }

      return await fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {

        return await fastify.db.profiles.delete(request.params.id);
      } catch (e) {
        throw fastify.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      try {
        
        return await fastify.db.profiles.change(request.params.id, request.body);
      }
      catch (e) {
        throw fastify.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
      }
    }
  );
};

export default plugin;
