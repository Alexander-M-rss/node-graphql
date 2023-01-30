import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {

    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({key: 'id', equals: request.params.id});

      if (!user) {
        throw fastify.httpErrors.notFound('User not found');
      }

      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {

      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });

      if (!user) {
          throw fastify.httpErrors.badRequest('User not found');
      }
      (await fastify.db.posts.findMany({ key: 'userId', equals: request.params.id})).forEach(async (post) => {
        await fastify.db.posts.delete(post.id);
      });
      const profile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.params.id});
      if (profile) {
        await fastify.db.profiles.delete(profile.id);
      }
      (await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: request.params.id })).forEach(async (subscriber) => {
        await fastify.db.users.change(subscriber.id, { subscribedToUserIds: subscriber.subscribedToUserIds.filter((id) => id !== request.params.id) });
      });
      return await fastify.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (request.params.id === request.body.userId) {
          throw fastify.httpErrors.badRequest('User cannot subscribe to himself');
      }

      const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId});

      if (!user) {
        throw fastify.httpErrors.badRequest('User not found');
      }

      if (user.subscribedToUserIds.includes(request.params.id)) {

        return user;
      }
      user.subscribedToUserIds.push(request.params.id);
      
      try {

        return await fastify.db.users.change(request.body.userId, { subscribedToUserIds: user.subscribedToUserIds });
      } catch (e) {
        throw fastify.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
      }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
    const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId});

    if (!user) {
      throw fastify.httpErrors.badRequest('User not found');
    }
    if (!user.subscribedToUserIds.includes(request.params.id)) {
      throw fastify.httpErrors.badRequest('User hasn`t this subscription');
    }
    if (request.body.userId === request.params.id) {
      return user;
    }
    try {

      return await fastify.db.users.change(request.body.userId, { subscribedToUserIds: user.subscribedToUserIds.filter((id) => id !== request.params.id) });
    } catch (e) {
      throw fastify.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
    }
  }
);

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        
        return await fastify.db.users.change(request.params.id, request.body);
      }
      catch (e) {
        throw fastify.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
      }
    }
  );
};

export default plugin;
