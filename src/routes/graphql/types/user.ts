import { FastifyInstance } from 'fastify';
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLMemberType, GraphQLPost, GraphQLProfile } from '.';

export const GraphQLUser: GraphQLObjectType = new GraphQLObjectType({
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
      type: new GraphQLList(GraphQLUser),
      resolve: async (user, args, contextValue: FastifyInstance) => {
        return await contextValue.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id});
      }
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (user, args, contextValue: FastifyInstance) => {
        return user.subscribedToUserIds.map(async (id: string) => {
          return await contextValue.db.users.findOne({key: 'id', equals: id});
        })
      }
    },
  }),
});
