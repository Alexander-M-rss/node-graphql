import { FastifyInstance } from 'fastify';
import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GraphQLPost, GraphQLCreatePostInput, GraphQLUser, GraphQLCreateUserInput, GraphQLCreateProfileInput, GraphQLProfile, GraphQLUpdateUserInput, GraphQLUpdateProfileInput, GraphQLUpdatePostInput, GraphQLMemberType, GraphQLUpdateMemberTypeInput, GraphQLUserIdInput } from './types';

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
    updateUser: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        user: {
          type: new GraphQLNonNull(GraphQLUpdateUserInput),
        },
      },
      resolve: async (source, { id, user }, contextValue: FastifyInstance) => {
        try {
          console.log({ id, user });
        
          return await contextValue.db.users.change(id, user);
        }
        catch (e) {
          throw contextValue.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
        }
      },
    },
    updateProfile: {
      type: GraphQLProfile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        profile: {
          type: new GraphQLNonNull(GraphQLUpdateProfileInput),
        },
      },
      resolve: async (source, { id, profile }, contextValue: FastifyInstance) => {
        try {
        
          return await contextValue.db.profiles.change(id, profile);
        }
        catch (e) {
          throw contextValue.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
        }
      },
    },
    updatePost: {
      type: GraphQLPost,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        post: {
          type: new GraphQLNonNull(GraphQLUpdatePostInput),
        },
      },
      resolve: async (source, { id, post }, contextValue: FastifyInstance) => {
        try {
        
          return await contextValue.db.posts.change(id, post);
        }
        catch (e) {
          throw contextValue.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
        }
      },
    },
    updateMemberType: {
      type: GraphQLMemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        memberType: {
          type: new GraphQLNonNull(GraphQLUpdateMemberTypeInput),
        },
      },
      resolve: async (source, { id, memberType }, contextValue: FastifyInstance) => {
        try {
        
          return await contextValue.db.memberTypes.change(id, memberType);
        }
        catch (e) {
          throw contextValue.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
        }
      },
    },
    subscribeTo: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        subscribeToUser: {
          type: new GraphQLNonNull(GraphQLUserIdInput),
        },
      },
      resolve: async (source, { id, subscribeToUser }, contextValue: FastifyInstance) => {
        if (id === subscribeToUser.id) {
          throw contextValue.httpErrors.badRequest('User cannot subscribe to himself');
        }

        const user = await contextValue.db.users.findOne({ key: 'id', equals: subscribeToUser.id});

        if (!user) {
          throw contextValue.httpErrors.badRequest('User not found');
        }

        if (user.subscribedToUserIds.includes(id)) {

          return user;
        }
        user.subscribedToUserIds.push(id);
        
        try {

          return await contextValue.db.users.change(subscribeToUser.id, { subscribedToUserIds: user.subscribedToUserIds });
        } catch (e) {
          throw contextValue.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
        }
      },

    },
    unsubscribeFrom: {
      type: GraphQLUser,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        unsubscribeFromUser: {
          type: new GraphQLNonNull(GraphQLUserIdInput),
        },
      },
      resolve: async (source, { id, unsubscribeFromUser }, contextValue: FastifyInstance) => {
        const user = await contextValue.db.users.findOne({ key: 'id', equals: unsubscribeFromUser.id});

        if (!user) {
          throw contextValue.httpErrors.badRequest('User not found');
        }
        if (!user.subscribedToUserIds.includes(id)) {
          throw contextValue.httpErrors.badRequest('User hasn`t this subscription');
        }
        try {
    
          return await contextValue.db.users.change(unsubscribeFromUser.id, { subscribedToUserIds: user.subscribedToUserIds.filter((subscriberId) => subscriberId !== id) });
        } catch (e) {
          throw contextValue.httpErrors.badRequest(e instanceof Error ? e.message : undefined);
        }
      },
    },
  },
});