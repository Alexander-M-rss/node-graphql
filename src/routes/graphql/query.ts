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
import { FastifyInstance } from 'fastify';

export const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberTypes: {
      type: new GraphQLList(GraphQLMemberType),
      resolve: async (source, args, contextValue: FastifyInstance) => {

        return contextValue.db.memberTypes.findMany();
      },
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (source, args, contextValue: FastifyInstance) => {

        return await contextValue.db.posts.findMany();
      },
    },
    profiles: { type: new GraphQLList(GraphQLProfile),
      resolve: async (source, args, contextValue: FastifyInstance) => {

        return await contextValue.db.profiles.findMany()
      },
    },
    users: { type: new GraphQLList(GraphQLUser),
      resolve: async (source, args, contextValue: FastifyInstance) => {

        return await contextValue.db.users.findMany()
      }
    },
    memberType: {
      type: GraphQLMemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, contextValue: FastifyInstance) => {
        const memberType = await contextValue.db.memberTypes.findOne({
          key: 'id',
          equals: id,
        });

        if (!memberType) {
          throw contextValue.httpErrors.notFound('Member type not found');
        }

        return memberType;
      },
    },
    post: {
      type: GraphQLPost,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, contextValue: FastifyInstance) => {
        const post = await contextValue.db.posts.findOne({
          key: 'id',
          equals: id,
        });

        if (!post) {
          throw contextValue.httpErrors.notFound('Post not found');
        }

        return post;
      },
    },
    profile: {
      type: GraphQLProfile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, contextValue: FastifyInstance) => {
        const profile = await contextValue.db.profiles.findOne({
          key: 'id',
          equals: id,
        });

        if (!profile) {
          throw contextValue.httpErrors.notFound('Profile not found');
        }

        return profile;
      },
    },
    user: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, { id }, contextValue: FastifyInstance) => {
        const user = await contextValue.db.users.findOne({
          key: 'id',
          equals: id,
        });

        if (!user) {
          throw contextValue.httpErrors.notFound('User not found');
        }

        return user;
      },
    },
  },
});
