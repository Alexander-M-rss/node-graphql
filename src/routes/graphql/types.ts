import { FastifyInstance } from 'fastify';
import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const GraphQLMemberType = new GraphQLObjectType({
  name: 'GraphQLMemberType',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

export const GraphQLPost = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

export const GraphQLProfile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLString },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    userId: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  }),
});

export const GraphQLBasicUser = new GraphQLObjectType({
  name: 'BasicUser',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  })
,});

export const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (user, args, contextValue: FastifyInstance) => {
        return await contextValue.db.posts.findMany({key: 'userId', equals: user.id});
      }
    },
    profile: {
      type: GraphQLProfile,
      resolve: async (user, args, contextValue: FastifyInstance) => {
        return await contextValue.db.profiles.findOne({key: 'userId', equals: user.id});
      }
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (user, args, contextValue: FastifyInstance) => {
        const profile = await contextValue.db.profiles.findOne({key: 'userId', equals: user.id});

        if (!profile) {

          return Promise.resolve(null);
        }

        return await contextValue.db.memberTypes.findOne({key: 'id', equals: profile.memberTypeId});
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLBasicUser),
      resolve: async (user, args, contextValue: FastifyInstance) => {
        return await contextValue.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id});
      }
    },
  }),
});
