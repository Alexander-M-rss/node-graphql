import { GraphQLList, GraphQLObjectType } from "graphql";
import { GraphQLMemberType, GraphQLPost, GraphQLProfile, GraphQLUser } from "./types";
import {FastifyInstance} from "fastify";

export const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberTypes: { type: new GraphQLList(GraphQLMemberType),
      resolve: async (source, args, contextValue: FastifyInstance) => {

        return contextValue.db.memberTypes.findMany();
      },
    },
    posts: { type: new GraphQLList(GraphQLPost),
      resolve: async (source, args, contextValue: FastifyInstance) => {

        return await contextValue.db.posts.findMany()
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
  },
});