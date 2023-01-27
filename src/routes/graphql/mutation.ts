import { FastifyInstance } from 'fastify';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLPost, GraphQLCreatePostInput, GraphQLUser, GraphQLCreateUserInput, GraphQLCreateProfileInput, GraphQLProfile } from './types';

export const rootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    createUser: {
      type: GraphQLUser,
      args: {
        user: { type: new GraphQLNonNull(GraphQLCreateUserInput) }
      },
      resolve: async (source, { user }, contextValue: FastifyInstance) => {
        return await contextValue.db.users.create(user);
      },
    },
    createProfile: {
      type: GraphQLProfile,
      args: {
        profile: { type: new GraphQLNonNull(GraphQLCreateProfileInput) }
      },
      resolve: async (source, { profile }, contextValue: FastifyInstance) => {
        return await contextValue.db.profiles.create(profile);
      },
    },
    createPost: {
      type: GraphQLPost,
      args: {
        post: { type: new GraphQLNonNull(GraphQLCreatePostInput) }
      },
      resolve: async (source, { post }, contextValue: FastifyInstance) => {
        return await contextValue.db.posts.create(post);
      },
    },
  },
});