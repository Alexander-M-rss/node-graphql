import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { GraphQLMemberType, GraphQLPost, GraphQLProfile } from '.';
import { Context } from './context';

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
      resolve: async (user, args, context: Context) => {
        return await context.postsByUserIdLoader.load(user.id);
      }
    },
    profile: {
      type: GraphQLProfile,
      resolve: async (user, args, context: Context) => {
        return await context.profileByUserIdLoader.load(user.id);
      }
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (user, args, context: Context) => {
        const profile = await context.profileByUserIdLoader.load(user.id);

        if (!profile) {

          return Promise.resolve(null);
        }

        return await context.memberTypeLoader.load(profile.memberTypeId);
      }
    },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (user, args, context: Context) => {
        return await context.subscriptionsByUserIdLoader.load(user.id)
      }
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (user, args, context: Context) => {

        return await context.userLoader.loadMany(user.subscribedToUserIds);
      }
    },
  }),
});

export const GraphQLCreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const GraphQLUpdateUserInput = new GraphQLInputObjectType({
  name: 'UpdateUserInput',
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
  }),
});

export const GraphQLUserIdInput = new GraphQLInputObjectType({
  name: 'UserIdInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
  }),
});
