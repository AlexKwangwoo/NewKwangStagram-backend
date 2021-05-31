import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    me: protectedResolver((_, __, { loggedInUser }) =>
      client.user.findUnique({
        where: {
          id: loggedInUser.id,
        },
        include: {
          following: true,
          //내가 following 중인 사용자들만 include하라고 얘기하는것임
          //디폴트는 false임!
          //안써주면..null되어버림 관계는 직접 써줘야함..
          //만약 팔로잉이 1억명이면..?

          followers: true,
        },
      })
    ),
  },
};
