import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  GraphQLUser,
} from './types';
import { Context } from './types/context';

export const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberTypes: {
      type: new GraphQLList(GraphQLMemberType),
      resolve: async (source, args, context: Context) => {
        const memberTypes = await context.fastify.db.memberTypes.findMany();

        memberTypes.forEach((type) => context.memberTypeLoader.prime(type.id, type));

        return memberTypes;
      },
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (source, args, context: Context) => {
        const posts = await context.fastify.db.posts.findMany();

        posts.forEach((post) => context.postLoader.prime(post.id, post));

        return posts;
      },
    },
    profiles: { type: new GraphQLList(GraphQLProfile),
      resolve: async (source, args, context: Context) => {
        const profiles = await context.fastify.db.profiles.findMany();

        profiles.forEach((profile) => context.profileLoader.prime(profile.id, profile));

        return profiles;
      },
    },
    users: { type: new GraphQLList(GraphQLUser),
      resolve: async (source, args, context: Context) => {
        const users = await context.fastify.db.users.findMany();

        users.forEach((user) => {
          context.userLoader.prime(user.id, user);
          context.subscriptionsByUserIdLoader.prime(user.id,
            users.filter((subscription) => subscription.subscribedToUserIds.includes(user.id))
          );
        });

        return users;
      }
    },
    memberType: {
      type: GraphQLMemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, context: Context) => {
        const memberType = await context.memberTypeLoader.load(id);

        if (!memberType) {
          throw context.fastify.httpErrors.notFound('Member type not found');
        }

        return memberType;
      },
    },
    post: {
      type: GraphQLPost,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, context: Context) => {
        const post = await context.postLoader.load(id);

        if (!post) {
          throw context.fastify.httpErrors.notFound('Post not found');
        }

        return post;
      },
    },
    profile: {
      type: GraphQLProfile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, context: Context) => {
        const profile = await context.profileLoader.load(id);

        if (!profile) {
          throw context.fastify.httpErrors.notFound('Profile not found');
        }

        return profile;
      },
    },
    user: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, context: Context) => {
        const user = await context.userLoader.load(id);

        if (!user) {
          throw context.fastify.httpErrors.notFound('User not found');
        }

        return user;
      },
    },
  },
});
