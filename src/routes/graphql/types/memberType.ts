import {
  GraphQLInputObjectType,
  GraphQLInt,
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

export const GraphQLUpdateMemberTypeInput = new GraphQLInputObjectType({
  name: 'UpdateMemberTypeInput',
  fields: () => ({
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});