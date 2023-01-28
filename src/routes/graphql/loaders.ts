import DataLoader = require('dataloader');
import DB from "../../utils/DB/DB";

const createMemeberTypeLoader = (db: DB) => {
  const batchFn = async (ids:Readonly<string[]>) => {
    const memberTypes = await db.memberTypes.findMany({ key: "id", equalsAnyOf: [...ids] });

    return ids.map((id) => memberTypes.find((memberType) => memberType.id === id) ?? null);
  }

  return new DataLoader(batchFn);
};

const createPostLoader = (db: DB) => {
  const batchFn = async (ids:Readonly<string[]>) => {
    const posts = await db.posts.findMany({ key: "id", equalsAnyOf: [...ids] });

    return ids.map((id) => posts.find((post) => post.id === id) ?? null);
  }

  return new DataLoader(batchFn);
};

const createProfileLoader = (db: DB) => {
  const batchFn = async (ids:Readonly<string[]>) => {
    const profiles = await db.profiles.findMany({ key: "id", equalsAnyOf: [...ids] });

    return ids.map((id) => profiles.find((profile) => profile.id === id) ?? null);
  }

  return new DataLoader(batchFn);
};

const createUserLoader = (db: DB) => {
  const batchFn = async (ids:Readonly<string[]>) => {
    const users = await db.users.findMany({ key: "id", equalsAnyOf: [...ids] });

    return ids.map((id) => users.find((users) => users.id === id) ?? null);
  }

  return new DataLoader(batchFn);
};


const createProfileByUserIdLoader = (db: DB) => {
  const batchFn = async (userIds:Readonly<string[]>) => {
    const profiles = await db.profiles.findMany({ key: "userId", equalsAnyOf: [...userIds] });

    return userIds.map((userId) => profiles.find((profile) => profile.userId === userId) ?? null);
  }

  return new DataLoader(batchFn);
};

const createPostsByUserIdLoader = (db: DB) => {
  const batchFn = async (userIds:Readonly<string[]>) => {
    const posts = await db.posts.findMany({ key: "userId", equalsAnyOf: [...userIds] });

    return userIds.map((userId) => posts.filter((post) => post.userId === userId) ?? null);
  }

  return new DataLoader(batchFn);
};

const createSubscriptionsByUserIdLoader = (db: DB) => {
  const batchFn = async (userIds:Readonly<string[]>) => {
    const users = await db.users.findMany({ key: "subscribedToUserIds", inArrayAnyOf: [...userIds] });

    return userIds.map((userId) => users.filter((user) => user.subscribedToUserIds.includes(userId)) ?? null);
  }

  return new DataLoader(batchFn);
};

export function createLoaders(db: DB) {

  const memberTypeLoader = createMemeberTypeLoader(db);
  const postLoader = createPostLoader(db);
  const profileLoader = createProfileLoader(db);
  const userLoader = createUserLoader(db);
  const profileByUserIdLoader = createProfileByUserIdLoader(db);
  const postsByUserIdLoader = createPostsByUserIdLoader(db);
  const subscriptionsByUserIdLoader = createSubscriptionsByUserIdLoader(db);

  return {
    memberTypeLoader,
    postLoader,
    userLoader,
    profileLoader,
    profileByUserIdLoader,
    postsByUserIdLoader,
    subscriptionsByUserIdLoader,
  };
}